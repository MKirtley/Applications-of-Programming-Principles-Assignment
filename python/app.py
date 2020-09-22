from flask import Flask, send_from_directory, jsonify, request, make_response, render_template

app = Flask(__name__)


@app.route('/')
def send_html():
    """Locate and send the html.
    :return the html file.
    """
    return app.send_static_file('users.html')


@app.route('/css/<file>')
def send_css(file):
    """Locate and send the CSS.
    :return the CSS file.
    """
    return app.send_static_file('css/' + file)


@app.route('/javascript/<file>')
def send_javascript(file):
    """Locate and send the JavaScript.
    :return the JavaScript file.
    """
    return app.send_static_file('javascript/' + file)


@app.route('/api/users', methods=['GET'])
def get_user_list():
    """Sends the user list. Slices the list into 6 users per page.
    :return user_list and user_slice.
    """
    page_number = int(request.args['page'])
    user_slice = user_list[page_number * 6 - 6:page_number * 6]

    return jsonify({"total": len(user_list),
                    "total_pages": len(user_list) + 5 / 6,
                    "data": user_slice})


@app.route('/api/users/<user_id>', methods=['GET'])
def get_single_user(user_id):
    """Cycle through the user_list, match user_id with the ID of the user in user_list.
    :param user_id: The user ID of the selected user.
    :return the matched user from user_list.
    """
    if len(user_id) == 0:
        return get_user_list()
    found_user_int = -1
    for user_position in range(0, len(user_list)):
        if user_list[user_position]['id'] == int(user_id):
            found_user_int = user_position

    if found_user_int >= 0:
        user = user_list[found_user_int]
        return jsonify({"data": user})
    else:
        return "missing user", 404


@app.route('/api/users', methods=['GET', 'POST'])
def post_user():
    """POST the created user and append it to user_list.
    :return the created user.
    """
    if request.method == "POST":
        user = request.get_json()
        user_list.append(user)
    else:
        return render_template('users.html')


@app.route('/api/users/<user_id>', methods=['PUT'])
def edit_single_user(user_id):
    """Update the data of the selected user.
    :param user_id: The user ID of the selected user.
    :return the updated user.
    """
    if request.method == "PUT":
        new_user = request.get_json()
    else:
        return render_template('users.html')

    if len(user_id) == 0:
        return get_user_list()
    found_user_int = -1
    for user_position in range(0, len(user_list)):
        if user_list[user_position]['id'] == int(user_id):
            found_user_int = user_position

    if found_user_int >= 0:
        user_list[found_user_int] = new_user
        return jsonify({"data": new_user})
    else:
        return "missing user", 404
    return new_user


@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_single_user(user_id):
    """Delete a user from user_list
    :param user_id: The user ID of the selected user.
    :return the selected user.
    """
    if len(user_id) == 0:
        return get_user_list()
    found_user_int = -1
    for user_position in range(0, len(user_list)):
        if user_list[user_position]['id'] == int(user_id):
            found_user_int = user_position

    if found_user_int >= 0:
        user = user_list[found_user_int]
        user_list.remove(user)
        return jsonify({"data": user})
    else:
        return "missing user", 404


"""The list of users.
"""
user_list = [
    {
        "id": 1,
        "email": "george.bluth@reqres.in",
        "first_name": "George",
        "last_name": "Bluth",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
    },
    {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
    },
    {
        "id": 3,
        "email": "emma.wong@reqres.in",
        "first_name": "Emma",
        "last_name": "Wong",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"
    },
    {
        "id": 4,
        "email": "eve.holt@reqres.in",
        "first_name": "Eve",
        "last_name": "Holt",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
    },
    {
        "id": 5,
        "email": "charles.morris@reqres.in",
        "first_name": "Charles",
        "last_name": "Morris",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
    },
    {
        "id": 6,
        "email": "tracey.ramos@reqres.in",
        "first_name": "Tracey",
        "last_name": "Ramos",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
    },
    {
        "id": 7,
        "email": "michael.lawson@reqres.in",
        "first_name": "Michael",
        "last_name": "Lawson",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/follettkyle/128.jpg"
    },
    {
        "id": 8,
        "email": "lindsay.ferguson@reqres.in",
        "first_name": "Lindsay",
        "last_name": "Ferguson",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/araa3185/128.jpg"
    },
    {
        "id": 9,
        "email": "tobias.funke@reqres.in",
        "first_name": "Tobias",
        "last_name": "Funke",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/vivekprvr/128.jpg"
    },
    {
        "id": 10,
        "email": "byron.fields@reqres.in",
        "first_name": "Byron",
        "last_name": "Fields",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/russoedu/128.jpg"
    },
    {
        "id": 11,
        "email": "george.edwards@reqres.in",
        "first_name": "George",
        "last_name": "Edwards",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/mrmoiree/128.jpg"
    },
    {
        "id": 12,
        "email": "rachel.howell@reqres.in",
        "first_name": "Rachel",
        "last_name": "Howell",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg"
    },
    {
        "id": 13,
        "email": "aeon@aeon.com",
        "first_name": "Aeon",
        "last_name": "N/A",
        "avatar": "https://i.ibb.co/xHLB83B/100939153-349753359332989-637515361683505152-n.jpg"
    }
]

if __name__ == '__main__':
    app.run()
