export const quiz = {
  "id": "biology-grade-8-007-precise-explanations",
  "version": 1,
  "language": "de",
  "title": "Enzyme unterscheiden und Vorgänge vollständig erklären",
  "subtitle": "5 Mehrfachauswahlfragen, 5 Kurzantworten und 5 Erklärungen. Wähle alle richtigen Aussagen. Prüfe bei freien Antworten, ob du jeden Teil der Aufgabe beantwortet hast.",
  "label": "Biologie · Übungsset 007",
  "questions": [
    {
      "id": "bio007-label-the-reaction",
      "type": "mcq",
      "topic": "Enzym und Produkt",
      "skills": [
        "enzymes.action",
        "digestion.stomach",
        "digestion.proteins"
      ],
      "prompt": "Bei einer Eiweißspaltung im Magen werden drei Karten beschriftet: „Enzym“, „Ausgangsstoff“ und „entstandene kleinere Stücke“. Welche Zuordnungen passen?",
      "options": [
        {
          "id": "enzyme",
          "text": "Pepsin gehört auf die Karte „Enzym“."
        },
        {
          "id": "substrate",
          "text": "Die lange Eiweißkette gehört auf die Karte „Ausgangsstoff“."
        },
        {
          "id": "products",
          "text": "Peptide gehören auf die Karte „entstandene kleinere Stücke“."
        },
        {
          "id": "swap",
          "text": "Peptide gehören auf die Karte „Enzym“."
        },
        {
          "id": "used-up",
          "text": "Pepsin ist nach einer Spaltung vollständig verbraucht."
        }
      ],
      "correct": [
        "enzyme",
        "substrate",
        "products"
      ],
      "explanation": "Pepsin ist das Enzym, das eine Eiweißkette spaltet. Die kleineren Eiweißstücke heißen Peptide. Enzym und Produkte haben verschiedene Rollen; das Enzym wird bei seiner Reaktion nicht verbraucht."
    },
    {
      "id": "bio007-second-starch-portion",
      "type": "mcq",
      "topic": "Enzyme wiederverwenden",
      "skills": [
        "enzymes.action",
        "digestion.mouth"
      ],
      "prompt": "Amylase hat in einer Probe Stärke gespalten. Danach wird neue Stärke zugegeben. Die Amylase ist weiterhin funktionsfähig und die Bedingungen bleiben geeignet. Welche Aussagen stimmen?",
      "options": [
        {
          "id": "again",
          "text": "Die bereits vorhandene Amylase kann auch an der neu zugegebenen Stärke wirken."
        },
        {
          "id": "speed",
          "text": "Amylase beschleunigt die passende Spaltungsreaktion."
        },
        {
          "id": "once",
          "text": "Für jede neue Spaltung muss zwingend ein neues Amylasemolekül hergestellt werden."
        },
        {
          "id": "anything",
          "text": "Nach der ersten Spaltung kann Amylase auch beliebige Eiweiße und Fette spalten."
        }
      ],
      "correct": [
        "again",
        "speed"
      ],
      "explanation": "Amylase wird bei der Reaktion nicht verbraucht und kann erneut Stärke umsetzen. Sie beschleunigt die Reaktion und bleibt substratspezifisch; Wiederverwendung macht sie nicht zu einem Enzym für alle Stoffe."
    },
    {
      "id": "bio007-uptake-or-energy",
      "type": "mcq",
      "topic": "Aufnahme und Energiegewinnung",
      "skills": [
        "metabolism.energy",
        "digestion.intestines"
      ],
      "prompt": "Zuerst gelangt Glucose aus dem Dünndarm ins Blut. Später wird Glucose in einer Körperzelle abgebaut und nutzbare Energie wird frei. Welche Aussagen unterscheiden diese Vorgänge richtig?",
      "options": [
        {
          "id": "uptake",
          "text": "Der Weg durch die Dünndarmwand ins Blut heißt Resorption."
        },
        {
          "id": "energy",
          "text": "Der Abbau zur Bereitstellung von Energie gehört zum Energiestoffwechsel."
        },
        {
          "id": "same",
          "text": "Die Aufnahme ins Blut und der Abbau in einer Körperzelle sind derselbe Vorgang."
        },
        {
          "id": "building",
          "text": "Beim beschriebenen Abbau wird aus vielen Glucosebausteinen eine Stärkekette aufgebaut."
        }
      ],
      "correct": [
        "uptake",
        "energy"
      ],
      "explanation": "Resorption ist die Aufnahme von Nährstoffbausteinen durch die Darmwand. Beim Energiestoffwechsel werden Stoffe in Körperzellen abgebaut; dabei wird nutzbare Energie frei. Aufnahme und Nutzung sind unterschiedliche Schritte."
    },
    {
      "id": "bio007-missing-glycerin",
      "type": "mcq",
      "topic": "Fettmodelle ergänzen",
      "skills": [
        "nutrients.fats",
        "nutrients.building-blocks"
      ],
      "prompt": "Für zwei vollständige Triglyceridmodelle liegen sechs Fettsäurebausteine und ein Glycerinbaustein bereit. Welche Aussagen stimmen?",
      "options": [
        {
          "id": "missing",
          "text": "Es fehlt noch ein Glycerinbaustein."
        },
        {
          "id": "enough",
          "text": "Die sechs Fettsäuren reichen für zwei vollständige Modelle."
        },
        {
          "id": "amino",
          "text": "Eine Aminosäure kann den fehlenden Glycerinbaustein ersetzen."
        },
        {
          "id": "six",
          "text": "Aus den sechs Fettsäuren allein lassen sich sechs vollständige Triglyceridmodelle bauen."
        }
      ],
      "correct": [
        "missing",
        "enough"
      ],
      "explanation": "Jedes Triglyceridmodell enthält ein Glycerin und drei Fettsäuren. Für zwei Modelle braucht man zwei Glycerin und sechs Fettsäuren. Die Fettsäuren sind vollständig vorhanden; ein Glycerin fehlt."
    },
    {
      "id": "bio007-two-different-surfaces",
      "type": "mcq",
      "topic": "Kauen und Dünndarm",
      "skills": [
        "digestion.mouth",
        "digestion.intestines"
      ],
      "prompt": "Beim Essen eines Apfelstücks zerkleinern die Zähne die Nahrung. Später werden aufnehmbare Nährstoffbausteine durch die Dünndarmwand aufgenommen. Welche Aussagen sind richtig?",
      "options": [
        {
          "id": "food",
          "text": "Das Zerkleinern vergrößert die insgesamt zugängliche Oberfläche der Nahrung."
        },
        {
          "id": "wall",
          "text": "Falten und Zotten vergrößern die Oberfläche der Dünndarmwand."
        },
        {
          "id": "contact",
          "text": "Eine größere Nahrungsoberfläche erleichtert den Kontakt mit passenden Verdauungsenzymen."
        },
        {
          "id": "enzyme",
          "text": "Das Zerbeißen erzeugt zusätzliche Enzyme aus dem Apfelstück."
        },
        {
          "id": "blood",
          "text": "Die Zähne nehmen die Nährstoffbausteine direkt ins Blut auf."
        }
      ],
      "correct": [
        "food",
        "wall",
        "contact"
      ],
      "explanation": "Kauen schafft mehr zugängliche Nahrungsoberfläche für Enzyme. Falten und Zotten schaffen eine große Aufnahmefläche in der Darmwand. Zerkleinern erzeugt keine Verdauungsenzyme und ist keine Resorption."
    },
    {
      "id": "bio007-name-active-enzyme",
      "type": "frq",
      "topic": "Kurzantwort · Enzymname",
      "skills": [
        "digestion.stomach",
        "enzymes.action"
      ],
      "prompt": "„Pepsin“ und „Peptide“ stehen auf zwei Karten. Welche Karte nennt das Enzym, das im Magen lange Eiweißketten spaltet? Schreibe nur den passenden Namen."
    },
    {
      "id": "bio007-name-starch-unit",
      "type": "frq",
      "topic": "Kurzantwort · Stärkeaufbau",
      "skills": [
        "nutrients.building-blocks"
      ],
      "prompt": "Ein Stärkemodell besteht aus sehr vielen gleichen, verbundenen Zuckerbausteinen. Wie heißt diese Bausteinart? Antworte mit einem Wort."
    },
    {
      "id": "bio007-name-protective-coating",
      "type": "frq",
      "topic": "Kurzantwort · Magenschutz",
      "skills": [
        "digestion.stomach"
      ],
      "prompt": "Gesucht ist die schützende Auflage auf der Magenschleimhaut, nicht das Gewebe selbst. Wie heißt diese Auflage, die die Magenwand vor dem Magensaft schützt? Antworte mit einem Begriff."
    },
    {
      "id": "bio007-name-energy-metabolism",
      "type": "frq",
      "topic": "Kurzantwort · Energieversorgung",
      "skills": [
        "metabolism.energy"
      ],
      "prompt": "Auch beim ruhigen Sitzen benötigt der Körper Energie, etwa für die Körperwärme. Wie heißt der Bereich des Stoffwechsels, bei dem Nährstoffe abgebaut werden und nutzbare Energie frei wird? Nenne den Fachbegriff."
    },
    {
      "id": "bio007-enzyme-examples-list",
      "type": "frq",
      "topic": "Kurzantwort · Beispiele einordnen",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Amylase, Pepsin und Lipase: Sind das „alle Enzyme des Körpers“ oder „Beispiele für Enzyme“? Schreibe nur die passende Wortgruppe."
    },
    {
      "id": "bio007-enzyme-explainer",
      "type": "frq",
      "topic": "Erklärung · Was Enzyme leisten",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Du sollst einem jüngeren Kind erklären, warum der Körper Enzyme braucht. Schreibe 3–4 Sätze und beantworte alle drei Fragen: Wie verändern Enzyme die Geschwindigkeit einer chemischen Reaktion? Warum passt nicht jeder Stoff zu jedem Enzym? Warum kann dasselbe Enzym mehrere passende Stoffteilchen nacheinander umsetzen?"
    },
    {
      "id": "bio007-repair-protein-caption",
      "type": "frq",
      "topic": "Erklärung · Eine Beschriftung berichtigen",
      "skills": [
        "digestion.proteins",
        "digestion.stomach",
        "digestion.intestines",
        "enzymes.action"
      ],
      "prompt": "Unter einem Bild zur Verdauung von Eiweiß aus Joghurt steht: „Peptide sind Enzyme. Sie zerlegen Pepsin im Magen zu Aminosäuren.“ Schreibe eine richtige Bildunterschrift aus 3–4 Sätzen. Verwende Pepsin, Eiweiß, Peptide und Aminosäuren richtig und beschreibe auch, wie die Verdauung im Dünndarm weitergeht."
    },
    {
      "id": "bio007-complete-potato-account",
      "type": "frq",
      "topic": "Erklärung · Vom Aufbau zur Verwendung",
      "skills": [
        "nutrients.building-blocks",
        "metabolism.energy",
        "digestion.intestines"
      ],
      "prompt": "Eine Erklärung lautet: „Die Stärke aus Kartoffeln wird bei der Verdauung zerlegt. Am Ende wird Glucose durch die Dünndarmwand ins Blut aufgenommen.“ Ergänze diese Erklärung in 2–4 eigenen Sätzen um die beiden fehlenden Punkte: Wie ist Stärke aufgebaut? Was kann mit der aufgenommenen Glucose in einer Muskelzelle geschehen, und wozu dient das?"
    },
    {
      "id": "bio007-stomach-three-jobs",
      "type": "frq",
      "topic": "Erklärung · Schutz und Verdauung",
      "skills": [
        "digestion.stomach",
        "enzymes.action"
      ],
      "prompt": "Der Magen soll Eiweiß verdauen und gleichzeitig seine eigene Wand schützen. Erkläre in 3–4 Sätzen, welchen Beitrag Salzsäure, Pepsin und die Schleimschicht dazu leisten. Begründe dabei, warum die schützende Schleimschicht das eiweißspaltende Enzym nicht ersetzen kann."
    },
    {
      "id": "bio007-compare-cell-processes",
      "type": "frq",
      "topic": "Erklärung · Zwei Vorgänge in Zellen",
      "skills": [
        "metabolism.energy",
        "metabolism.building",
        "nutrients.roles"
      ],
      "prompt": "In Körperzellen laufen zwei Vorgänge ab: A – Glucose wird abgebaut und nutzbare Energie wird frei. B – Aus Aminosäuren entstehen neue körpereigene Eiweiße. Ordne A und B den Bereichen des Stoffwechsels zu und erkläre in 3–4 Sätzen ihren Unterschied. Begründe auch, warum Vorgang B Energie benötigt."
    }
  ],
  "testId": "biology-grade-8-2026-11",
  "canonicalPath": "./"
};
