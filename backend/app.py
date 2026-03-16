import os
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS


from line_level_detect import detect_lines
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

 
print("Loading GraphCodeBERT scanner into memory...")
MODEL_PATH = "./securecode_model_v5_final"
tokenizer = AutoTokenizer.from_pretrained("microsoft/graphcodebert-base")
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()
print(f"Scanner loaded successfully on {device}!")


@app.route('/scan', methods=['POST'])
def scan_code():
    """Scans code using GraphCodeBERT and returns line-level labels."""
    data = request.json
    if not data or 'code' not in data:
        return jsonify({"error": "No code provided"}), 400
        
    code = data['code']
    
    try:
        # Run your detection cascade
        results = detect_lines(model, tokenizer, code)
        return jsonify({"scan_results": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/fix', methods=['POST'])
def fix_code():
    """Uses local Ollama model (Qwen) to fix vulnerabilities."""
    data = request.json
    if not data or 'code' not in data or 'scan_results' not in data:
        return jsonify({"error": "Missing code or scan_results"}), 400
        
    original_code = data['code']
    scan_results = data['scan_results']
    
    issues = [res for res in scan_results if res['label'] in [0, 2]] # 0 = vulnerable, 2 = hallucinated
    
    if not issues:
        return jsonify({"fixed_code": original_code, "message": "No issues to fix!"}), 200

    prompt = f"""
You are a strict secure coding assistant. Rewrite the following code to fix the security vulnerabilities.
Maintain the exact same functionality, but ensure proper secure coding practices. 

CRITICAL RULES:
1. Do not include fake security wrappers or explanations. 
2. Return ONLY the raw fixed code, ready to compile.
3. For SQL, strictly use parameterized queries.
4. For OS commands, NEVER use `os.system` or string formatting. Strictly use the `subprocess` module with argument lists (e.g., `subprocess.run(["command", arg])`).
5. If a command uses output redirection (>), do not include it in the argument list. Instead, use Python's open() function and pass it to the stdout parameter of subprocess.run.

Original Code:
{original_code}

Vulnerable Lines to Fix:
{issues}
"""

    try:
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "qwen2.5-coder:1.5b",
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.1} 
        })
        
        if response.status_code == 200:
            raw_response = response.json().get('response', '')
            
            
            match = re.search(r'```(?:python|py)?\s*(.*?)\s*```', raw_response, re.IGNORECASE | re.DOTALL)
            fixed_code = match.group(1).strip() if match else raw_response.strip()
                
            return jsonify({"fixed_code": fixed_code}), 200
        else:
            return jsonify({"error": f"Ollama failed with status {response.status_code}"}), 500
            
    except requests.exceptions.ConnectionError:
        return jsonify({"error": "Cannot connect to Ollama. Is the server running?"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=7860)