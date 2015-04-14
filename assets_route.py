from bottle import route, static_file, get

################################################################################
# Static Routes: js, css, img, fonts
#root_url = '/home/jmao/mapserver/'
root_url = './'
@get('/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root= root_url + 'assets/js')

@get('/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root= root_url + 'assets/css')

@get('/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root= root_url + 'assets/img')

@get('/<filename:re:.*\.(eot|ttf|woff|svg)>')
def fonts(filename):
    return static_file(filename, root= root_url + 'assets/fonts')

