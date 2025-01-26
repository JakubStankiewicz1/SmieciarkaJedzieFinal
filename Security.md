# Zabezpieczenia przed SQL Injection w Projekcie

## Spis Treści
1. [Wprowadzenie](#wprowadzenie)
2. [Mechanizmy Zabezpieczające](#mechanizmy-zabezpieczające)
   - [Parametryzowane Zapytania SQL](#parametryzowane-zapytania-sql)
   - [Walidacja Danych Użytkownika](#walidacja-danych-użytkownika)
3. [Przykłady Implementacji](#przykłady-implementacji)
4. [Przykłady Testów przy użyciu SQLMap](#przykłady-testów-przy-użyciu-sqlmap)
5. [Podsumowanie](#podsumowanie)

---

## Wprowadzenie
W niniejszym projekcie jednym z głównych celów było zapewnienie wysokiego poziomu bezpieczeństwa aplikacji, w szczególności zabezpieczenie przed atakami typu **SQL Injection**. SQL Injection to technika ataku, w której złośliwy użytkownik może wstrzyknąć swoje własne zapytanie SQL do aplikacji, wykorzystując dane wejściowe, które są następnie używane w zapytaniach SQL.

Celem tej dokumentacji jest przedstawienie sposobu, w jaki zabezpieczyliśmy naszą aplikację przed tego rodzaju zagrożeniem, stosując odpowiednie mechanizmy ochrony.

---

## Mechanizmy Zabezpieczające

### Parametryzowane Zapytania SQL
Podstawowym mechanizmem ochrony przed SQL Injection w tym projekcie jest stosowanie **parametryzowanych zapytań SQL**. Zamiast wstawiać dane użytkownika bezpośrednio do zapytania SQL, korzystamy z parametrów, które zapewniają, że dane są traktowane jako wartości, a nie jako część zapytania SQL.

Przykład zastosowania parametrów w zapytaniu SQL:

```python
cursor.execute("SELECT * FROM uzytkownik WHERE email = %s", (data["email"],))
```

Zamiast:

```python
cursor.execute("SELECT * FROM uzytkownik WHERE email = '" + data["email"] + "'")
```

Dzięki temu, nawet jeśli dane wejściowe zawierają złośliwy kod SQL, nie zostanie on wykonany, ponieważ dane są traktowane jako wartości, a nie część zapytania.

### Walidacja Danych Użytkownika
W projekcie zastosowano także walidację danych użytkownika, która sprawdza poprawność wprowadzanych danych, takich jak email, hasło, numer telefonu czy imię. Taka walidacja zapewnia, że dane wprowadzane do systemu są zgodne z wymaganiami aplikacji i nie stanowią potencjalnego zagrożenia.

---

## Przykłady Implementacji

### Przykład zapytania SQL z wykorzystaniem parametrów:
```python
cursor.execute("SELECT * FROM uzytkownik WHERE email = %s", (data["email"],))
```

### Przykład walidacji danych w JavaScript:
#### Walidacja emaila:
```javascript
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

#### Walidacja hasła:
```javascript
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*]/.test(password);
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  );
};
```

#### Walidacja numeru telefonu:
```javascript
const validatePhone = (phone) => /^\+?[0-9]{7,}$/.test(phone);
```

#### Walidacja daty ważności:
```javascript
const currentDate = new Date();
const expirationDate = new Date(termin_waznosci);
if (expirationDate <= currentDate) {
  toast.error("Data ważności musi być w przyszłości.");
  return false;
}
```

---

## Przykłady Testów przy użyciu SQLMap

Testy zabezpieczeń przed SQL Injection przeprowadzono przy użyciu narzędzia **sqlmap**. Poniżej przedstawiono wybrane scenariusze testowe:

### Test 1: Formularz logowania
```bash
sqlmap -u "http://localhost:5174/login" --data="email=test@example.com&password=test123" --method=POST --batch
```
![Wynik Testu 1](https://github.com/user-attachments/assets/c96e04df-70a6-4bc5-9ec4-ddacf3693808)


![image](https://github.com/user-attachments/assets/99d56056-9c4c-4320-b556-a7a1662b2589)


---

### Test 2: Formularz rejestracyjny
```bash
sqlmap -u "http://localhost:5174/register" --data="email=test@example.com&haslo=password123&imie=John&nazwisko=Doe&telefon=1234567890" --method=POST --risk=3 --level=5 --batch
```
![Wynik Testu 2](https://github.com/user-attachments/assets/df97f795-849c-4e61-9fa2-6e0327be045d)


![image](https://github.com/user-attachments/assets/993b8512-d0d0-42ea-8f1d-80dc82889477)


---

### Test 3: Formularz dodawania ogłoszenia
```bash
sqlmap -u "http://localhost:5174/addProduct" --data="tytul=test&kategoria_id=1&opis=opis testowy&miasto_id=1&ulica_id=1&numer_domu=1&termin_waznosci=2025-01-14T12:00&zdjecie=test.jpg" --level=3 --risk=2 --method=POST
```
![Wynik Testu 3](https://github.com/user-attachments/assets/eb066023-6b38-44fd-bbec-a5141196e82f)


![image](https://github.com/user-attachments/assets/a9a7dc56-9d4a-4f45-a405-7560a1fc735f)


---

## Podsumowanie

W projekcie zastosowano kluczowe mechanizmy ochrony przed SQL Injection, takie jak parametryzowane zapytania SQL oraz walidację danych użytkownika. Testy przy użyciu narzędzia **sqlmap** wykazały skuteczność zastosowanych zabezpieczeń, co potwierdza odporność aplikacji na tego rodzaju ataki. Dzięki temu zapewniamy wysoki poziom bezpieczeństwa użytkowników oraz danych przechowywanych w systemie.




---
---



# Atak z wykorzystaniem SQL Injection 

### Login Vulnerability

```
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    db = get_replica_connection()
    if db is None:
        return jsonify({"message": "Database connection error"}), 500

    cursor = db.cursor(dictionary=True)
    query = f"SELECT * FROM uzytkownik WHERE email = '{data['email']}'"
    
    try:
        logging.debug(f"Executing query: {query}")
        cursor.execute(query)
        user = cursor.fetchone()
        logging.debug(f"User fetched: {user}")
        # Fetch all results to avoid "Unread result found" error
        cursor.fetchall()
    except mysql.connector.Error as err:
        logging.error(f"Database error: {err}")
        return jsonify({"message": "Database error"}), 500
    finally:
        cursor.close()
        db.close()

    if user:
        logging.debug(f"Checking password for user: {user['email']}")
        if user["haslo"]:
            # Generate token JWT
            expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            payload = {"user_id": user["id"], "exp": expiration_time}
            token = jwt.encode(
                payload,
                os.environ.get("SECRET_KEY", "default_secret_key"),
                algorithm="HS256",
            )

            return (
                jsonify({"message": "Login successful", "token": token, "user_id": user["id"]}),
                200,
            )
        else:
            logging.debug("Password check failed")
    return jsonify({"message": "Invalid email or password"}), 401
```


### Example of SQL Injection


- **Email:** `' OR '1'='1`
- **Password:** `anything`

This input modifies the SQL query as follows:

```sql
SELECT * FROM uzytkownik WHERE email = '' OR '1'='1' AND haslo = 'anything'
```




![Zrzut ekranu 2025-01-19 201322](https://github.com/user-attachments/assets/f3257368-e8be-4598-960d-5dd1c0ac11d2)




### Login Query Vulnerability

```
query = f"SELECT * FROM uzytkownik WHERE email = '{data['email']}'"
```

```
SELECT * FROM uzytkownik WHERE email = '' OR '1'='1'
```


Zamiast:

```
cursor.execute("SELECT * FROM uzytkownik WHERE email = %s", (data["email"],))
```
(Przekazywanie jako parametr)


### Po usunięciu szyfrowania haseł w bazie danych udało się skutecznie zalogować



![bandicam2025-01-1922-05-54-547online-video-cutter com1-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/ed5d9ace-e99e-4492-9d5c-936e550d2df8)
