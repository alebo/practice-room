export const quiz = {
  "id": "biology-grade-8-2026-11-011-complete-process-explanations",
  "version": 1,
  "language": "de",
  "title": "Vollständig erklären: Energie, Bausteine und Verdauung",
  "subtitle": "5 Mehrfachauswahlfragen, 5 Lückentexte und 5 Erklärungen. Wähle alle richtigen Aussagen. Fülle bei Lückentexten jede Nummer aus. Prüfe bei Erklärungen: Ort, Vorgang und Zweck.",
  "label": "Biologie · Übungsset 011",
  "questions": [
    {
      "id": "bio011-precise-energy",
      "type": "mcq",
      "topic": "Stoff und Energie",
      "skills": [
        "metabolism.energy"
      ],
      "prompt": "Welche Sätze eignen sich für eine fachlich genaue Erklärung der Energieversorgung einer Muskelzelle?",
      "options": [
        {
          "id": "breakdown",
          "text": "Glucose wird in der Muskelzelle abgebaut."
        },
        {
          "id": "release",
          "text": "Beim Abbau wird nutzbare Energie für Muskelarbeit frei."
        },
        {
          "id": "identity",
          "text": "Glucose ist selbst eine Form von Muskelkraft und kein Stoff."
        },
        {
          "id": "transport",
          "text": "Der Transport im Blut ersetzt den Abbau von Glucose in der Muskelzelle."
        }
      ],
      "correct": [
        "breakdown",
        "release"
      ],
      "explanation": "Glucose ist ein Stoff. Bei ihrem Abbau wird Energie frei, die die Zelle nutzen kann. Der Transport bringt Glucose zur Zelle, erklärt aber noch nicht ihre Nutzung."
    },
    {
      "id": "bio011-protein-assembly",
      "type": "mcq",
      "topic": "Bausteine und Aufbau",
      "skills": [
        "metabolism.building",
        "nutrients.roles"
      ],
      "prompt": "Eine Körperzelle stellt ein Eiweiß her. Welche Aussagen beschreiben die Rolle der Aminosäuren richtig?",
      "options": [
        {
          "id": "units",
          "text": "Aminosäuren sind Bausteine, die zu einer Eiweißkette verbunden werden können."
        },
        {
          "id": "own",
          "text": "Aus aufgenommenen Aminosäuren können körpereigene Eiweiße entstehen."
        },
        {
          "id": "energy",
          "text": "Für das Zusammensetzen wird Energie benötigt."
        },
        {
          "id": "finished",
          "text": "Jede einzelne Aminosäure ist bereits ein fertiges körpereigenes Eiweiß."
        },
        {
          "id": "blood",
          "text": "Das Blut setzt bei jedem Transport alle Aminosäuren automatisch zu Eiweißen zusammen."
        }
      ],
      "correct": [
        "units",
        "own",
        "energy"
      ],
      "explanation": "Aminosäuren sind selbst die Bausteine von Eiweißen. Zellen verbinden sie zu körpereigenen Eiweißen. Dieser Aufbau benötigt Energie; Transport und Aufbau sind verschiedene Vorgänge."
    },
    {
      "id": "bio011-three-locations",
      "type": "mcq",
      "topic": "Orte unterscheiden",
      "skills": [
        "digestion.intestines",
        "metabolism.energy"
      ],
      "prompt": "Welche Zuordnungen von Ort und Vorgang stimmen für den Weg von Glucose zur Energieversorgung einer Muskelzelle?",
      "options": [
        {
          "id": "wall",
          "text": "Dünndarmwand: Glucose wird in den Körper aufgenommen."
        },
        {
          "id": "blood",
          "text": "Blut: Glucose wird zu Körperzellen transportiert."
        },
        {
          "id": "muscle",
          "text": "Muskelzelle: Glucose wird zur Bereitstellung nutzbarer Energie abgebaut."
        },
        {
          "id": "teeth",
          "text": "Zähne: Glucose wird ins Blut gepumpt."
        },
        {
          "id": "same",
          "text": "Dünndarmwand und Muskelzelle sind zwei Namen für denselben Ort."
        }
      ],
      "correct": [
        "wall",
        "blood",
        "muscle"
      ],
      "explanation": "Glucose wird durch die Dünndarmwand aufgenommen, mit dem Blut transportiert und kann in Muskelzellen zur Energieversorgung abgebaut werden. Diese Schritte finden an unterschiedlichen Orten statt."
    },
    {
      "id": "bio011-fat-retention",
      "type": "mcq",
      "topic": "Fettbausteine wiederholen",
      "skills": [
        "nutrients.fats",
        "nutrients.building-blocks",
        "nutrients.roles"
      ],
      "prompt": "Für vier Triglyceridmodelle werden Bausteine bereitgelegt. Welche Aussagen stimmen?",
      "options": [
        {
          "id": "glycerin",
          "text": "Vier Glycerinbausteine werden benötigt."
        },
        {
          "id": "acids",
          "text": "Zwölf Fettsäurebausteine werden benötigt."
        },
        {
          "id": "store",
          "text": "Fette können dem Körper als Energiereserve dienen."
        },
        {
          "id": "amino",
          "text": "Die benötigten Kettenbausteine sind Aminosäuren statt Fettsäuren."
        }
      ],
      "correct": [
        "glycerin",
        "acids",
        "store"
      ],
      "explanation": "Ein Triglycerid enthält ein Glycerin und drei Fettsäuren. Vier Modelle benötigen daher vier Glycerin und zwölf Fettsäuren. Fette dienen unter anderem als Energiespeicher."
    },
    {
      "id": "bio011-stomach-and-intestine",
      "type": "mcq",
      "topic": "Verdauungsstationen",
      "skills": [
        "digestion.stomach",
        "digestion.intestines",
        "digestion.proteins"
      ],
      "prompt": "Welche Aussagen unterscheiden Magen und Dünndarm bei der Eiweißverdauung richtig?",
      "options": [
        {
          "id": "stomach",
          "text": "Im Magen spaltet Pepsin Eiweiß in Peptide."
        },
        {
          "id": "intestine",
          "text": "Im Dünndarm setzen weitere Enzyme die Zerlegung bis zu Aminosäuren fort."
        },
        {
          "id": "mucus",
          "text": "Die Schleimschicht schützt die Magenwand vor dem Magensaft."
        },
        {
          "id": "swap",
          "text": "Pepsin baut im Dünndarm aus Aminosäuren neue Muskeleiweiße."
        },
        {
          "id": "acid",
          "text": "Salzsäure ist ein anderer Name für Aminosäuren."
        }
      ],
      "correct": [
        "stomach",
        "intestine",
        "mucus"
      ],
      "explanation": "Pepsin wirkt im Magen; weitere Verdauungsenzyme wirken im Dünndarm. Die Schleimschicht schützt die Magenwand. Körpereigene Eiweiße werden später in Körperzellen aufgebaut."
    },
    {
      "id": "bio011-two-places",
      "type": "frq",
      "topic": "Lücken: Transport und Nutzung",
      "skills": [
        "metabolism.energy"
      ],
      "prompt": "Ergänze beide Orte: „Glucose wird mit dem (1) ___ transportiert. Für die Energieversorgung einer Muskelzelle wird sie in der (2) ___ abgebaut.“ Schreibe 1 und 2 mit den fehlenden Begriffen."
    },
    {
      "id": "bio011-building-units",
      "type": "frq",
      "topic": "Lücken: Eiweiß aufbauen",
      "skills": [
        "metabolism.building",
        "nutrients.building-blocks"
      ],
      "prompt": "Ergänze: „Die Bausteine von Eiweißen heißen (1) ___. Körperzellen verbinden sie beim (2) ___ zu körpereigenen Eiweißen.“ Schreibe die beiden fehlenden Fachbegriffe in Reihenfolge."
    },
    {
      "id": "bio011-energy-verb",
      "type": "frq",
      "topic": "Lücken: Energie bereitstellen",
      "skills": [
        "metabolism.energy"
      ],
      "prompt": "Ergänze: „Beim (1) ___ von Glucose in einer Körperzelle wird nutzbare (2) ___ frei.“ Schreibe die beiden fehlenden Wörter in Reihenfolge."
    },
    {
      "id": "bio011-enzyme-recall",
      "type": "frq",
      "topic": "Lücken: Enzyme",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Ergänze: „Enzyme (1) ___ chemische Reaktionen. Bei der Reaktion werden sie nicht (2) ___ und können deshalb wiederholt wirken.“ Schreibe beide fehlenden Wörter in Reihenfolge."
    },
    {
      "id": "bio011-two-surfaces",
      "type": "frq",
      "topic": "Lücken: Oberflächen",
      "skills": [
        "digestion.mouth",
        "digestion.intestines"
      ],
      "prompt": "Ergänze: „Kauen vergrößert die zugängliche Oberfläche der (1) ___. Zotten vergrößern die Oberfläche der (2) ___.“ Schreibe die beiden fehlenden Begriffe in Reihenfolge."
    },
    {
      "id": "bio011-three-sentence-route",
      "type": "frq",
      "topic": "Aufnahme, Transport, Nutzung",
      "skills": [
        "digestion.intestines",
        "metabolism.energy"
      ],
      "prompt": "Glucose aus einer Mahlzeit soll die Muskelarbeit beim Tanzen ermöglichen. Beschreibe ihren Weg ab dem Dünndarm in drei Schritten: Aufnahme, Transport und Nutzung in der Muskelzelle. Erkläre im letzten Schritt, was mit der Glucose geschieht und wie das die Bewegung ermöglicht. Etwa 3–4 Sätze genügen."
    },
    {
      "id": "bio011-correct-building-claim",
      "type": "frq",
      "topic": "Bausteine richtig erklären",
      "skills": [
        "metabolism.building",
        "metabolism.energy",
        "nutrients.roles"
      ],
      "prompt": "Ein Lernzettel behauptet: „Aminosäuren helfen nur dabei, andere Bausteine herzustellen. Eiweiße entstehen dann ohne Energie.“ Korrigiere beide Teile. Erkläre außerdem, wie der Abbau von Glucose Energie für den Aufbau eines körpereigenen Eiweißes bereitstellen kann. Etwa 3–4 Sätze genügen."
    },
    {
      "id": "bio011-substance-versus-energy",
      "type": "frq",
      "topic": "Eine Erklärung präzisieren",
      "skills": [
        "metabolism.energy"
      ],
      "prompt": "Warum ist der Satz „Glucose verwandelt sich einfach in Energie“ als Erklärung ungenau? Schreibe eine genauere Erklärung für eine Körperzelle und nenne eine Verwendung der dabei frei werdenden Energie außer Bewegung. Etwa 2–3 Sätze genügen."
    },
    {
      "id": "bio011-enzyme-definition-transfer",
      "type": "frq",
      "topic": "Enzyme vollständig erklären",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Erkläre einem Mitschüler in etwa 3 Sätzen, was ein Enzym ist. Gehe auf die Geschwindigkeit chemischer Reaktionen, passende Ausgangsstoffe und die wiederholte Wirkung desselben Enzyms ein. Ein Beispiel allein reicht nicht."
    },
    {
      "id": "bio011-chewing-versus-uptake",
      "type": "frq",
      "topic": "Zwei Hilfen für die Verdauung",
      "skills": [
        "digestion.mouth",
        "digestion.intestines",
        "enzymes.action"
      ],
      "prompt": "Ein Bissen wird gründlich gekaut. Später treffen seine verdauten Nährstoffbausteine auf eine Dünndarmwand mit vielen Zotten. Erkläre, welche Oberfläche jeweils vergrößert ist und warum das einmal die Enzymwirkung und einmal die Aufnahme erleichtert. Etwa 3–4 Sätze genügen."
    }
  ],
  "testId": "biology-grade-8-2026-11",
  "canonicalPath": "../../../tests/biology-grade-8-2026-11/011-complete-process-explanations/"
};
