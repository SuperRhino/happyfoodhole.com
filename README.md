# happyfoodhole.com
> http://happyfoodhole.com/

## Install

- Install virtual environment:
  1. Create: `virtualenv venv`
  2. Activate: `source venv/bin/activate`
  3. Install: `pip install -r requirements.txt`
  4. Create requirements.txt: `pip freeze > requirements.txt`
- Before running it, Flask needs to be told how to import it, by setting the FLASK_APP environment variable:
  - ```(venv) $ export FLASK_APP=run.py```

## Running

- `(venv) $ flask run`
