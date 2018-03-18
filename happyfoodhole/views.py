from flask import render_template
from happyfoodhole import app

@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Ryan'}
    return render_template('index.html', title='Happy Food Hole', user=user)
