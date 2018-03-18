from flask import Flask

app = Flask(__name__)
app.static_folder = 'static'
app.template_folder = 'html'

from happyfoodhole import views

if __name__ == "__main__":
    app.run()
