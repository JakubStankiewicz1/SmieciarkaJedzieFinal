from flask import Flask, request, jsonify, session
import mysql.connector
import os
from flask_cors import CORS
import logging
import bcrypt
import jwt
import datetime

# Włączenie logowania
logging.basicConfig(level=logging.DEBUG)

certs_dir = f"{os.path.dirname(__file__)}/database/certs/client"


# Funkcja łącząca się z bazą danych
def get_replica_connection():
    try:
        db = mysql.connector.connect(
            host="localhost",
            port=3307,
            user="read_user",
            password="aoA34ginGI4OAA3PO134GgAPF135OK",
            database="SmieciarkaJedzie",
            ssl_ca=f"{certs_dir}/ca.pem",
            ssl_cert=f"{certs_dir}/client-cert.pem",
            ssl_key=f"{certs_dir}/client-key.pem",
        )
        logging.info("Database connection successful.")
        return db
    except mysql.connector.Error as err:
        logging.error(f"Error connecting to database: {err}")
        return None


def get_master_connection():
    try:
        db = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="write_user",
            password="jfi532AFn13oiAA5Fom5A332AF",
            database="SmieciarkaJedzie",
            ssl_ca=f"{certs_dir}/ca.pem",
            ssl_cert=f"{certs_dir}/client-cert.pem",
            ssl_key=f"{certs_dir}/client-key.pem",
        )
        logging.info("Database connection successful.")
        return db
    except mysql.connector.Error as err:
        logging.error(f"Error connecting to database: {err}")
        return None


# Inicjalizacja aplikacji Flask
app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "default_secret_key")  # Ustawienie klucza sesji
CORS(app, resources={r"/*": {"origins": "*"}})  # Zezwolenie na wszystkie źródła/scieżki -> inaczej błądy ciągle zwązane z CORS


# Route do rejestracji użytkownika
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    hashed_password = bcrypt.hashpw(data["haslo"].encode("utf-8"), bcrypt.gensalt())
    db = get_master_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor()
    query = """
    INSERT INTO uzytkownik (imie, nazwisko, email, telefon, haslo, zdjecie_profilowe)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    try:
        cursor.execute(
            query,
            (
                data["imie"],
                data["nazwisko"],
                data["email"],
                data["telefon"],
                hashed_password,
                data.get("zdjecie_profilowe"),
            ),
        )
        db.commit()
        response = jsonify({"message": "User registered successfully"})
        status_code = 201
    except mysql.connector.IntegrityError as err:
        if err.errno == 1062:
            response = jsonify({"message": "User with this email already exists"})
            status_code = 409
        else:
            response = jsonify({"message": "Database error"})
            status_code = 500
    finally:
        cursor.close()
        db.close()

    return response, status_code


# Route do logowania użytkownika
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM uzytkownik WHERE email = %s", (data["email"],))
    user = cursor.fetchone()
    cursor.close()
    db.close()

    if user and bcrypt.checkpw(data["haslo"].encode("utf-8"), user["haslo"].encode("utf-8")):
        # Generate token JWT
        expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        payload = {"user_id": user["id"], "exp": expiration_time}
        token = jwt.encode(
            payload,
            os.environ.get("SECRET_KEY", "default_secret_key"),
            algorithm="HS256",
        )

        # Send token and user ID in the response
        return (
            jsonify({"message": "Login successful", "token": token, "user_id": user["id"]}),
            200,
        )
    else:
        return jsonify({"message": "Invalid email or password"}), 401


# Route do pobierania wszystkich miast
@app.route("/miasto", methods=["GET"])
def get_miasto():
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM miasto")
    miasto = cursor.fetchall()
    cursor.close()
    db.close()

    response = jsonify(miasto)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# Route do pobierania wszystkich kategorii
@app.route("/kategoria", methods=["GET"])
def get_kategoria():
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM kategoria")
    kategoria = cursor.fetchall()
    cursor.close()
    db.close()

    response = jsonify(kategoria)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# Route do pobierania wszystkich ulic
@app.route("/ulica", methods=["GET"])
def get_ulica():
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ulica")
    ulica = cursor.fetchall()
    cursor.close()
    db.close()

    response = jsonify(ulica)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# Route do pobierania wszystkich ogłoszeń
@app.route("/ogloszenie", methods=["GET"])
def get_ogloszenia():
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM ogloszenie")
    ogloszenie = cursor.fetchall()
    cursor.close()
    db.close()

    response = jsonify(ogloszenie)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 200


# Route do pobierania konkretnego ogłoszenia po ID
@app.route("/ogloszenie/<int:id>", methods=["GET"])
def get_ogloszenie(id):
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor(dictionary=True)
    query = """
    SELECT ogloszenie.*, 
        ulica.nazwa AS ulica_nazwa, 
        miasto.nazwa AS miasto_nazwa, 
        uzytkownik.imie AS autor_imie, 
        uzytkownik.nazwisko AS autor_nazwisko,
        uzytkownik.zdjecie_profilowe AS autor_zdjecie,
        uzytkownik.data_rejestracji AS autor_data_rejestracji
    FROM ogloszenie
    JOIN ulica ON ogloszenie.ulica_id = ulica.id
    JOIN miasto ON ogloszenie.miasto_id = miasto.id
    JOIN uzytkownik ON ogloszenie.uzytkownik_id = uzytkownik.id
    WHERE ogloszenie.id = %s
    """
    cursor.execute(query, (id,))
    ogloszenie = cursor.fetchone()
    cursor.close()
    db.close()

    if ogloszenie:
        response = jsonify(ogloszenie)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    else:
        response = jsonify({"message": "Announcement not found"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 404


# Route do pobierania ogłoszeń konkretnego użytkownika
@app.route("/ogloszenie/user/<int:id>", methods=["GET"])
def get_ogloszenia_user(id):
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor(dictionary=True)
    query = """
    SELECT ogloszenie.*, ulica.nazwa AS ulica_nazwa, miasto.nazwa AS miasto_nazwa
    FROM ogloszenie
    JOIN ulica ON ogloszenie.ulica_id = ulica.id
    JOIN miasto ON ogloszenie.miasto_id = miasto.id
    WHERE ogloszenie.uzytkownik_id = %s
    """
    cursor.execute(query, (id,))
    ogloszenia = cursor.fetchall()
    cursor.close()
    db.close()

    if ogloszenia:
        response = jsonify(ogloszenia)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    else:
        response = jsonify({"message": "No announcements found for this user"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 404


# Route do tworzenia nowego ogłoszenia
@app.route("/ogloszenie", methods=["POST"])
def create_ogloszenie():
    data = request.get_json()
    db = get_master_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor()
    query = """
    INSERT INTO ogloszenie (tytul, zdjecie, kategoria_id, opis, miasto_id, ulica_id, numer_domu, data_dodania, termin_waznosci, odebrane, uzytkownik_id)
    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s)
    """
    cursor.execute(
        query,
        (
            data["tytul"],
            data["zdjecie"],
            data["kategoria_id"],
            data["opis"],
            data["miasto_id"],
            data["ulica_id"],
            data["numer_domu"],
            data["termin_waznosci"],
            data["odebrane"],
            data["uzytkownik_id"],
        ),
    )
    db.commit()
    cursor.close()
    db.close()

    response = jsonify({"message": "Announcement created successfully"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response, 201


# Route do usunięcia ogłoszenia
@app.route("/ogloszenie/<int:id>", methods=["DELETE"])
def delete_ogloszenie(id):
    db = get_master_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT zdjecie FROM ogloszenie WHERE id = %s", (id,))
    ogloszenie = cursor.fetchone()
    if ogloszenie:
        file_path = ogloszenie["zdjecie"]
        if os.path.exists(file_path):
            os.remove(file_path)
        cursor.execute("DELETE FROM ogloszenie WHERE id = %s", (id,))
        db.commit()
        cursor.close()
        db.close()

        response = jsonify({"message": "Announcement and file deleted successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200
    else:
        cursor.close()
        db.close()

        response = jsonify({"message": "Announcement not found"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 404


# Route to update date of end of product pick up
@app.route("/ogloszenie/<int:id>/update_date", methods=["PATCH"])
def update_expiration_date(id):
    data = request.get_json()
    db = get_master_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor()
    query = "UPDATE ogloszenie SET termin_waznosci = %s WHERE id = %s"
    try:
        cursor.execute(query, (data["termin_waznosci"], id))
        db.commit()
        response = jsonify({"message": "Expiration date updated successfully"})
        status_code = 200
    except mysql.connector.Error as err:
        logging.error(f"Error updating expiration date: {err}")
        response = jsonify({"message": "Database error"})
        status_code = 500
    finally:
        cursor.close()
        db.close()

    return response, status_code


@app.route("/ogloszenie/<int:id>/rezerwacja", methods=["PATCH"])
def reserve_ogloszenie(id):
    data = request.get_json()
    db = get_master_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor()
    query_check_user = """
    SELECT uzytkownik_id FROM ogloszenie WHERE id = %s
    """
    cursor.execute(query_check_user, (id,))
    owner_id = cursor.fetchone()

    # Check if owner_id is not None and compare the user_id
    if owner_id and owner_id[0] == data["uzytkownik_id"]:
        return jsonify({"message": "Nie możesz zarezerwować własnego produktu."}), 400

    query = """
    UPDATE ogloszenie
    SET zarezerwowane = TRUE, uzytkownik_rezerwujacy_id = %s
    WHERE id = %s AND zarezerwowane = FALSE
    """
    try:
        cursor.execute(query, (data["uzytkownik_id"], id))
        db.commit()

        if cursor.rowcount == 0:
            response = jsonify({"message": "Reservation failed. Product may already be reserved."})
            status_code = 400
        else:
            response = jsonify({"message": "Product successfully reserved"})
            status_code = 200
    except mysql.connector.Error as err:
        logging.error(f"Error reserving product: {err}")
        response = jsonify({"message": "Database error"})
        status_code = 500
    finally:
        cursor.close()
        db.close()

    return response, status_code


# Route do pobrania rezerwacji użytkownika
@app.route("/uzytkownik/<int:user_id>/rezerwacje", methods=["GET"])
def get_user_reservations(user_id):
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor(dictionary=True)  # Użycie trybu z asocjacyjnymi danymi
    query = """
    SELECT ogloszenie.*
           , uzytkownik.imie AS autor_imie
           , uzytkownik.nazwisko AS autor_nazwisko
           , miasto.nazwa AS miasto_nazwa
           , ulica.nazwa AS ulica_nazwa
           , ogloszenie.numer_domu
    FROM ogloszenie
    INNER JOIN uzytkownik ON ogloszenie.uzytkownik_id = uzytkownik.id
    INNER JOIN miasto ON ogloszenie.miasto_id = miasto.id
    INNER JOIN ulica ON ogloszenie.ulica_id = ulica.id
    WHERE ogloszenie.uzytkownik_rezerwujacy_id = %s
    """
    try:
        cursor.execute(query, (user_id,))
        data = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(data), 200
    except mysql.connector.Error as err:
        logging.error(f"Error fetching user reservations: {err}")
        db.close()
        return jsonify({"message": "Database error"}), 500


@app.route("/ogloszenia/rezerwacje/<int:user_id>")
def get_reserved_products(user_id):
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor(dictionary=True)
    query = """
    SELECT * FROM ogloszenie
    WHERE uzytkownik_rezerwujacy_id = %s
    """
    try:
        cursor.execute(query, (user_id,))
        products = cursor.fetchall()
    except mysql.connector.Error as err:
        logging.error(f"Error fetching reserved products: {err}")
        return jsonify({"message": "Database error"}), 500
    finally:
        cursor.close()
        db.close()

    return jsonify(products), 200


@app.route("/ogloszenie/<int:id>/usun_rezerwacje", methods=["PATCH"])
def cancel_reservation(id):
    data = request.get_json()
    db = get_master_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor()
    query = """
    UPDATE ogloszenie
    SET zarezerwowane = FALSE, uzytkownik_rezerwujacy_id = NULL
    WHERE id = %s AND uzytkownik_rezerwujacy_id = %s
    """
    try:
        cursor.execute(query, (id, data["uzytkownik_id"]))
        db.commit()

        if cursor.rowcount == 0:
            response = jsonify({"message": "Nie udało się anulować rezerwacji. Upewnij się, że rezerwacja istnieje i należy do Ciebie."})
            status_code = 400
        else:
            response = jsonify({"message": "Rezerwacja została pomyślnie anulowana."})
            status_code = 200
    except mysql.connector.Error as err:
        logging.error(f"Error canceling reservation: {err}")
        response = jsonify({"message": "Database error"})
        status_code = 500
    finally:
        cursor.close()
        db.close()

    return response, status_code

# Uruchomienie aplikacji Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)
