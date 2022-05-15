# CloudComputing2022

Link-ul către clipul video pentru descrierea proiectului: https://youtu.be/oNHlmo6_d_A 

Link-ul către aplicație: https://stark-chamber-14952.herokuapp.com/ 

Link-ul către backend: https://github.com/comanstefaniacatalina/CloudComputing2022/tree/02_main_functionality 

Link-ul către frontend: 
https://github.com/comanstefaniacatalina/cloudcomputingfrontend/tree/list_and_submition 

1. Introducere:

În cadrul proiectului o sa fie folosite  cunoștințe de tehnologii web pentru a realiza o aplicație web destinata folosirii unor tehnologii de cloud computing studiate în cadrul modulului parcurs.
	Pentru verificarea continutului in cadrul githubului, repository-urile au fost realizate cu mai multe branch-uri.

2.  Descriere problemă:

Aplicația web o sa aiba scopul de a permite utilizatorilor sa trimită mesaje, mailuri către orice persoană din lume și în orice limba dorită. Așadar comunicarea poate sa fie foarte eficientă, un utilizator care dorește sa comunice cu o persoana de peste hotare care este vorbitoare de alta limba poate sa trimită un mesaj care o sa fie trimis către destinatar în numai câteva momente. Toate acestea pot sa fie făcute în timp real prin intermediul Cloud-ului si prin folosirea unor API-uri care ne ajuta sa facem atat traducerea mesajelor transmise, cat și sa reusim sa le trimitem.

3. Descriere API:

Cloud Storage: Obiectivul Cloud Storage este acela de a oferii capacitate de stocare pentru companiile care își doresc acest lucru, iar Google Cloud se asigura ca prin intermediul serviciilor lor vor beneficia de opțiuni multiple de redundanță și stocare de arhivă care pot fi folosite efectiv. Pentru proiect am folosit Cloud SQL, crearea acestui database relational a fost foarte rapid, doar prin intermediul consolei, la fel și pentru configurarea setărilor de networking pentru aceasta.

Publicarea aplicației: Publicarea aplicației se face cu ajutorul Heroku care este un PaaS, oferind un suport pentru mai multe limbaje de programare. Astfel prin publicarea repository-urilor din git-ul nostru pe Heroku, acestea vor putea mai apoi sa fie “pornite”, atat backend-ul și frontend-ul, iar prin integrarea corecta a acestora, după pornirea frontend-ului aplicația va putea sa fie folosită de oricine isi doreste.
	
Translate API de la Google: API care realizeaza traducerea este oferit de Google și pare sa fie unul dintre cele mai bune API de tradus care se afla în acest moment în cadrul Cloud. Activarea acestuia se face foarte eficient prin apasarea unui simplu buton din cadrul consolei de la Google Cloud Console. Modalitatea de încadrare a credentialelor pentru traducere în cadrul aplicației pot fi găsite și în cadrul documentației Google.

Sendgrid pentru trimiterea de mail-uri: Sendgrid este o platforma care ofera acest API prin care poate sa facă posibila trimiterea acestor mail-uri de pe adresa de mail care  a fost specificata în cadrul autentificării și creării contului.

4. Flux de date:

Exemple de request / response:

Cel mai important request din cadrul proiectului este cel care va recepționa mesajul și care se va folosi de cele doua API-uri, în primul rand pentru al traduce, iar în al doilea rând pentru a-l trimite.
Descriem parametrii pe care vrem să îi trimitem, iar apoi verificăm dacă unul din parametrii lipsește.Verificăm mai apoi dacă limba există, este transmisă cum trebuie și face parte din limbile date ca exemplu în secțiunea de dictionar.
Verificăm apariția erorilor cu try/catch, și pentru mesajul pe care dorim să-l trimitem verificam cele doua tipuri de alegeri: pentru toate limbile sau pentru o singura limba. Pentru varianta când va fi selectata opțiunea cu toate limbile atunci o sa fie necesară mai multe apeluri. Cu ajutorul functiei “Promise.all”, se va astepta raspuns de la fiecare limba inainte sa fie returnat răspunsul.
Funcția “Reduce” va fi cea care va transforma un array într-un singur String. Parametrii folosiți de reduce vor fi un acumulator și o valoare curentă, ea returnand după acumulatorul alături de valoarea curentă, despărțite printr-un spațiu.
Partea a doua a acestui request, este trimiterea de mesaje, urmând ca după aceasta sa fie înregistrate în baza de date înregistrările inițiale.

Metode HTTP: 

Metodele de tip HTTP pot sa fie asemanate cu metodele de tip CRUD.
Pentru aplicatia noastra, folosim spre exemplu metoda GET care cauta sau cere resurse, după ce folosim conexiunea creeata ca bază de date, apelăm la un query.
Query are un strig și un callback, se apelează query string și se executa un callback, verificăm dacă avem sau nu eroare, dacă nu exista erori, atunci se va întoarce un JSON.
Metoda GET este folosite pentru a selecta un mesaj din cele trimise sau pentru a selecta toate mesajele pe care noi le trimitem. Alături de metoda GET, am folosit și metoda POST, care realizeaza insertul în cadrul bazei de date. Așadar, am inserat un mesaj cu “senderName, senderMail, senderCountry, receiverCountry, receiverMail, messageContent”. În aceeași modalitate am folosit și o metoda de ștergere a unui anumit mesaj prin folosirea metodei HTTP DELETE. Metoda PUT a fost folosită pentru a face update pe un mesaj care a fost deja creat.
Toate metodele amintite mai sus au fost testate prin intermediul POSTMAN, după ce am creat o colecție pentru a face procesul mult mai eficient.



Autentificare și autorizare servicii utilizate: A fost nevoie de  autentificare pentru deschiderea conturilor necesare pentru obținerea API-urilor, dar și un cont pentru folosirea Cloud Storage-ului.



5. Capturi ecran aplicație:

Aplicația fără fieldurile completate

![1](https://user-images.githubusercontent.com/72125746/168474342-bca5f565-9f37-408f-987e-0fe4bc065089.png)

Limbile disponibile pentru traducere
![2](https://user-images.githubusercontent.com/72125746/168474481-c9e712c0-a73e-41be-b8b3-b0f6955a559e.png)

Completam fieldurile
![3](https://user-images.githubusercontent.com/72125746/168474485-a42fe3ef-8589-49b5-971b-1df288c2d705.png)

Ne apare mesajul tradus si limba originara in care a fost scris
![4](https://user-images.githubusercontent.com/72125746/168474491-fcae0a56-9c66-4b32-97d3-5dee7794f7af.png)

La un refresh putem vedea ca mesajul se afla in lista de mesaje din baza de date
![5](https://user-images.githubusercontent.com/72125746/168474496-26aac1c1-3fff-4c59-8e6e-cd8d5be6d3ef.png)



6. Referințe
https://cloud.google.com/translate#section-5 
https://sendgrid.com/ 
https://github.com/guritaalexandru
