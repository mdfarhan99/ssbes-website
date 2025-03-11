from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Chatbot Knowledge Base
database = {
    "college name": "SSBES Institute of Technology and Management, Nanded",
    "location": "Nanded, Maharashtra, India",
    "courses": "We offer BCA, BBA, and BSc HS programs.",
    "admission process": "You can apply online or offline. Submit documents and pay the fee.",
    "eligibility": "BCA requires 10+2 with Mathematics. BBA and BSc HS require 10+2 from any stream.",
    "fees structure": "For detailed fee information, please visit our official website or contact admissions.",
    "placement": "Top recruiters include Infosys, TCS, Wipro, and Accenture.",
    "contact": "You can reach us at info@ssbesitm.org or call +91 XXXXX XXXXX."
}

@app.route('/')
def home():
    # Render the index.html page that contains the chatbot UI and JS code.
    return render_template('index.html')

@app.route('/chatbot', methods=['POST'])
def chatbot():
    user_message = request.json.get("message").lower()
    response = "I'm sorry, I don't have that information."  # Default response
    
    for key in database:
        if key in user_message:
            response = database[key]
            break
    
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
