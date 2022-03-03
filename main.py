from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin
import assignment

app = Flask('app')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/stats', methods = ['GET'])
@cross_origin()
def get_oregon_trail_stats():    
    return dict(
        day = assignment.day,
        distance = assignment.distance,
        food = assignment.food,
        health = assignment.health
    )

@app.route('/action', methods = ['POST'])
@cross_origin()
def get_oregon_trail_result():
    json_data = request.get_json(force=True)

    assignment.clear_outputs()
    action = json_data['action']
    if action == 'travel':
        assignment.travel()
    if action == 'rest':
        assignment.rest()
    if action == 'hunt':
        assignment.hunt()
    if action == 'status':
        assignment.status()
    if action == 'help':
        assignment.help()

    print(assignment.outputs)
    
    return dict(
        results = assignment.outputs
    )

@app.route('/')
def index():
  return render_template('index.html')

app.run(host='0.0.0.0', port=8080)
