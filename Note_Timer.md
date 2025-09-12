**Note funzionamento Timer**
Per ogni domanda parte un timer di 10 sec,questo si aggiorna ogni secondo nel DOM.
Se scade, il sistema considera la risposta sbagliata, azzera lo streak e mostra il pulsante "Prossima".Se l’utente risponde prima dello scadere, il timer si ferma automaticamente.

**toISOString** restituisce sempre l’orario in UTC, quindi in Italia (UTC+2) l’orario sarà 2 ore indietro rispetto a quello locale, invece si usa toLocaleString()

quiz:history
[{"score":15,"date":"11/9/2025, 20:25:10","totalQuestions":5},
{"score":6,"date":"11/9/2025, 20:25:19","totalQuestions":5},
{"score":4,"date":"11/9/2025, 20:48:51","totalQuestions":5},
{"score":6,"date":"11/9/2025, 20:58:30","totalQuestions":5},
{"score":1,"date":"11/9/2025, 20:59:05","totalQuestions":5},
{"score":2,"date":"11/9/2025, 21:22:45","totalQuestions":5},
{"score":4,"date":"11/9/2025, 21:25:13","totalQuestions":5},
{"score":6,"date":"12/9/2025, 09:54:06","totalQuestions":5},
{"score":3,"date":"12/9/2025, 09:56:38","totalQuestions":5},
{"score":7,"date":"12/9/2025, 09:59:55","totalQuestions":5}]
