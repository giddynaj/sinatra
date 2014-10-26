import bottle
from bottle import hook, post, run, get, route,  request, response
import json
import pdb
from nltk.tokenize import sent_tokenize
from bs4 import BeautifulSoup as bs

class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors

app = bottle.app()

@app.route('/tokenize_sent', method=['OPTIONS','POST'])
def tokenize_sent():
  content = request.json['content']
  soup = bs(content)
  soup = soup.get_text()
  sent_tokenize_list = sent_tokenize(soup) 
  response.content_type = 'application/json' 
  return json.dumps(sent_tokenize_list)

app.install(EnableCors())

app.run(host='localhost', port=8080, debug=True)
