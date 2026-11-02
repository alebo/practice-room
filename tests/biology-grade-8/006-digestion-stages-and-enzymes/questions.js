export const quiz = {
  "id": "biology-grade-8-006-digestion-stages-and-enzymes",
  "version": 1,
  "language": "de",
  "title": "Verdauungsschritte und Enzyme sicher erklären",
  "subtitle": "5 Mehrfachauswahlfragen, 5 Kurzantworten und 5 Erklärungsaufgaben. Wähle bei MCQs alle richtigen Aussagen. Gehe bei Erklärungen auf jeden genannten Punkt ein.",
  "label": "Biologie · Übungsset 006",
  "questions": [
    {
      "id": "bio006-protein-route",
      "type": "mcq",
      "topic": "Eiweißverdauung",
      "skills": [
        "digestion.stomach",
        "digestion.proteins",
        "digestion.intestines"
      ],
      "prompt": "Eiweiß aus einem Stück Tofu wird verdaut. Welche Aussagen beschreiben die aufeinanderfolgenden Schritte richtig?",
      "options": [
        {
          "id": "pieces",
          "text": "Im Magen entstehen durch Pepsin kleinere Eiweißstücke, die Peptide."
        },
        {
          "id": "finished",
          "text": "Pepsin zerlegt das gesamte Eiweiß bereits im Magen vollständig in einzelne Aminosäuren."
        },
        {
          "id": "continue",
          "text": "Im Dünndarm setzen weitere Enzyme die Zerlegung bis zu einzelnen Aminosäuren fort."
        },
        {
          "id": "uptake",
          "text": "Die entstandenen Aminosäuren können durch die Dünndarmwand ins Blut gelangen."
        },
        {
          "id": "starch",
          "text": "Im Dünndarm werden die Peptide zu Stärke zusammengesetzt."
        }
      ],
      "correct": [
        "pieces",
        "continue",
        "uptake"
      ],
      "explanation": "Pepsin beginnt die Eiweißspaltung im Magen und bildet Peptide. Weitere Enzyme zerlegen diese im Dünndarm bis zu Aminosäuren. Danach können die Bausteine aufgenommen werden. Verdauung und Aufnahme sind unterschiedliche Schritte."
    },
    {
      "id": "bio006-enzyme-examples",
      "type": "mcq",
      "topic": "Enzyme einordnen",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "In einem Heft stehen Amylase, Pepsin und Lipase als Beispiele für Enzyme. Welche Aussagen darf man daraus und aus dem Wissen über Enzyme ableiten?",
      "options": [
        {
          "id": "only",
          "text": "Im menschlichen Körper gibt es insgesamt genau diese drei Enzyme."
        },
        {
          "id": "examples",
          "text": "Die drei Namen sind Beispiele; im Körper gibt es viele weitere Enzyme."
        },
        {
          "id": "speed",
          "text": "Enzyme beschleunigen chemische Reaktionen."
        },
        {
          "id": "universal",
          "text": "Alle Enzyme können dieselben Nährstoffe spalten."
        },
        {
          "id": "reuse",
          "text": "Ein Enzym kann nach einer Reaktion erneut wirken, weil es dabei nicht verbraucht wird."
        }
      ],
      "correct": [
        "examples",
        "speed",
        "reuse"
      ],
      "explanation": "Enzyme sind biologische Reaktionsbeschleuniger. Sie wirken an passenden Substraten und werden bei der Reaktion nicht verbraucht. Drei Beispiele sind keine vollständige Liste aller Enzyme."
    },
    {
      "id": "bio006-stomach-cards",
      "type": "mcq",
      "topic": "Magenwand und Magensaft",
      "skills": [
        "digestion.stomach"
      ],
      "prompt": "Für ein Magenmodell werden Funktionskarten geschrieben. Welche Karten sind fachlich richtig?",
      "options": [
        {
          "id": "mucus",
          "text": "Schleimschicht: schützt die Magenwand vor dem Magensaft."
        },
        {
          "id": "acid",
          "text": "Salzsäure: schafft das saure Milieu für Pepsin."
        },
        {
          "id": "replace",
          "text": "Schleimschicht: ersetzt Pepsin bei der Spaltung von Eiweiß."
        },
        {
          "id": "amylase",
          "text": "Salzsäure: ist ein anderer Name für Amylase."
        }
      ],
      "correct": [
        "mucus",
        "acid"
      ],
      "explanation": "Schleim schützt die Magenwand. Salzsäure sorgt unter anderem für passende saure Bedingungen. Die enzymatische Eiweißspaltung übernimmt Pepsin; weder Schleim noch Salzsäure ersetzen es."
    },
    {
      "id": "bio006-fat-components",
      "type": "mcq",
      "topic": "Fettbausteine und Verwendung",
      "skills": [
        "nutrients.fats",
        "nutrients.roles"
      ],
      "prompt": "Ein Triglycerid aus Speiseöl wird im Unterrichtsmodell vollständig in seine Bestandteile zerlegt. Welche Aussagen stimmen?",
      "options": [
        {
          "id": "glycerin",
          "text": "Dabei entsteht ein Glycerinbaustein."
        },
        {
          "id": "acids",
          "text": "Dabei entstehen drei Fettsäurebausteine."
        },
        {
          "id": "amino",
          "text": "Dabei entstehen drei Aminosäuren."
        },
        {
          "id": "reserve",
          "text": "Fette können dem Körper als Energiereserve dienen."
        },
        {
          "id": "only-acids",
          "text": "Das Modell besteht ausschließlich aus Fettsäuren."
        }
      ],
      "correct": [
        "glycerin",
        "acids",
        "reserve"
      ],
      "explanation": "Ein Triglycerid enthält ein Glycerin und drei Fettsäuren. Aminosäuren gehören zu Eiweißen. Neben ihrer Zusammensetzung ist die Funktion wichtig: Fette können Energie liefern und als Energiereserve gespeichert werden."
    },
    {
      "id": "bio006-surfaces-transfer",
      "type": "mcq",
      "topic": "Oberfläche und Verdauung",
      "skills": [
        "digestion.mouth",
        "digestion.intestines",
        "enzymes.action"
      ],
      "prompt": "Zwei Beobachtungen: Beim Kauen wird ein Bissen in viele Stücke geteilt. Die Dünndarmwand besitzt zahlreiche Falten und Zotten. Welche Erklärungen passen dazu?",
      "options": [
        {
          "id": "contact",
          "text": "Kleinere Nahrungsstücke bieten insgesamt mehr zugängliche Oberfläche für Verdauungsenzyme."
        },
        {
          "id": "uptake",
          "text": "Falten und Zotten vergrößern die Fläche für die Aufnahme von Nährstoffbausteinen."
        },
        {
          "id": "production",
          "text": "Durch das Zerbeißen entstehen neue Verdauungsenzyme aus den Zähnen."
        },
        {
          "id": "same",
          "text": "Darmzotten und Zähne haben dieselbe Aufgabe: Sie zerbeißen Nahrung."
        }
      ],
      "correct": [
        "contact",
        "uptake"
      ],
      "explanation": "Beide Beispiele nutzen eine große Oberfläche, aber für unterschiedliche Aufgaben. Zerkleinerte Nahrung bietet Enzymen mehr Kontaktfläche; Falten und Zotten schaffen mehr Aufnahmefläche in der Darmwand."
    },
    {
      "id": "bio006-peptide-term",
      "type": "frq",
      "topic": "Kurzantwort · Eiweißstücke",
      "skills": [
        "digestion.proteins",
        "digestion.stomach"
      ],
      "prompt": "Eine kurze Kette aus mehreren verbundenen Aminosäuren ist noch keine einzelne Aminosäure. Wie heißt ein solches kleineres Eiweißstück, wie es bei der Pepsinwirkung entsteht? Nenne den Fachbegriff."
    },
    {
      "id": "bio006-completion-organ",
      "type": "frq",
      "topic": "Kurzantwort · Verdauungsort",
      "skills": [
        "digestion.proteins",
        "digestion.intestines"
      ],
      "prompt": "In welchem Darmabschnitt werden die aus dem Magen kommenden Eiweißstücke durch weitere Enzyme bis zu einzelnen Aminosäuren zerlegt? Nenne nur den Darmabschnitt."
    },
    {
      "id": "bio006-mucus-term",
      "type": "frq",
      "topic": "Kurzantwort · Schutz",
      "skills": [
        "digestion.stomach"
      ],
      "prompt": "Welche schützende Schicht liegt auf der Innenseite der Magenwand und schützt sie vor dem Magensaft? Antworte mit einem Wort."
    },
    {
      "id": "bio006-speed-verb",
      "type": "frq",
      "topic": "Kurzantwort · Enzymwirkung",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Ergänze mit genau einem passenden Verb: „Enzyme ______ chemische Reaktionen, ohne dabei selbst verbraucht zu werden.“"
    },
    {
      "id": "bio006-energy-process",
      "type": "frq",
      "topic": "Kurzantwort · Stoffwechsel",
      "skills": [
        "metabolism.energy"
      ],
      "prompt": "In einer Muskelzelle wird Glucose abgebaut, wobei nutzbare Energie frei wird. Zu welchem Bereich des Stoffwechsels gehört dieser Vorgang? Nenne einen Begriff."
    },
    {
      "id": "bio006-trace-protein",
      "type": "frq",
      "topic": "Erklärung · Eiweiß auf dem Weg",
      "skills": [
        "digestion.stomach",
        "digestion.proteins",
        "digestion.intestines"
      ],
      "prompt": "Eine Mitschülerin sagt: „Nach dem Magen sind alle Eiweiße schon in einzelne Aminosäuren zerlegt; der Dünndarm muss sie nur noch aufnehmen.“ Korrigiere diese Aussage in 3–4 Sätzen. Beschreibe den Schritt im Magen mit Enzym und Produkt, die weitere Zerlegung im Dünndarm und die anschließende Aufnahme."
    },
    {
      "id": "bio006-enzyme-repeat",
      "type": "frq",
      "topic": "Erklärung · Enzyme erneut nutzen",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Ein Modell zeigt, wie ein Enzym ein passendes Substrat bindet, es spaltet und die Produkte freigibt. Danach trifft ein weiteres passendes Substrat ein. Erkläre in 3–4 Sätzen, was das Enzym grundsätzlich mit der Reaktionsgeschwindigkeit macht, ob dasselbe Enzym wieder wirken kann und weshalb ein beliebiges anderes Substrat nicht unbedingt passt."
    },
    {
      "id": "bio006-oat-starch-journey",
      "type": "frq",
      "topic": "Erklärung · Stärke verwerten",
      "skills": [
        "nutrients.building-blocks",
        "digestion.mouth",
        "digestion.intestines",
        "metabolism.energy"
      ],
      "prompt": "Haferflocken enthalten Stärke. Beschreibe in 4–5 Sätzen ihren Weg bis zur Nutzung in einer Muskelzelle. Gehe auf alle vier Punkte ein: Aufbau der Stärke; Beginn und Fortsetzung ihrer Zerlegung; Aufnahme ins Blut; Verwendung in der Muskelzelle."
    },
    {
      "id": "bio006-growth-metabolism",
      "type": "frq",
      "topic": "Erklärung · Energie und Aufbau",
      "skills": [
        "metabolism.energy",
        "metabolism.building",
        "nutrients.roles"
      ],
      "prompt": "Beim Wachstum werden neue Muskelproteine gebildet. Erkläre in 3–5 Sätzen den Energie- und den Aufbaustoffwechsel an diesem Beispiel. Beschreibe ausdrücklich, was mit den Stoffen in beiden Bereichen geschieht, nenne den Baustein der Muskelproteine und erkläre, warum beide Bereiche zusammenarbeiten müssen."
    },
    {
      "id": "bio006-stomach-division",
      "type": "frq",
      "topic": "Erklärung · Drei Aufgaben im Magen",
      "skills": [
        "digestion.stomach",
        "enzymes.action"
      ],
      "prompt": "In einer Beschreibung steht: „Salzsäure, Pepsin und Schleim machen im Magen alle dasselbe.“ Erkläre in 3–4 Sätzen, warum das falsch ist. Ordne jedem der drei Bestandteile seine Aufgabe zu und erläutere, weshalb ein saures Milieu allein die Aufgabe des Enzyms nicht ersetzt."
    }
  ],
  "canonicalPath": "./"
};
