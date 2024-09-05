from flask import Flask, request, jsonify
import pandas as pd
from pyspark.sql import SparkSession
import os

app = Flask(__name__)

# Initialize DataFrame
df = pd.DataFrame(columns=['Nome', 'Título do Sócio', 'Data', 'Senha'])

@app.route('/reserve', methods=['POST'])
def reserve():
    data = request.json
    name = data.get('name')
    title = data.get('title')
    date = data.get('date')
    password = data.get('password')
    
    # Validate password length
    if len(password) != 6:
        return jsonify({'error': 'A senha deve ter 6 dígitos.'}), 400

    # Add data to DataFrame
    global df
    df = df.append({
        'Nome': name,
        'Título do Sócio': title,
        'Data': date,
        'Senha': password
    }, ignore_index=True)
    
    # Save to Excel
    df.to_excel('reservas.xlsx', index=False)
    
    return jsonify({'message': 'Reserva realizada com sucesso!'})

if __name__ == '__main__':
    app.run(debug=True)
