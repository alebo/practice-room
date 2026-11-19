export const quiz = {
  "id": "biology-grade-8-009-explain-the-missing-steps",
  "version": 1,
  "language": "de",
  "title": "Vorgänge erklären: vom Nährstoff zur Körperzelle",
  "subtitle": "5 Mehrfachauswahlfragen, 5 Lückentexte und 5 Erklärungen. Wähle alle richtigen Aussagen. Trage bei Lückentexten nur die fehlenden Wörter in der angegebenen Reihenfolge ins Antwortfeld ein.",
  "label": "Biologie · Übungsset 009",
  "questions": [
    {
      "id": "bio009-enzyme-speed",
      "type": "mcq",
      "topic": "Enzymwirkung",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "In einem Gedankenversuch läuft dieselbe Spaltungsreaktion unter passenden Bedingungen mit einem Enzym schneller ab als ohne dieses Enzym. Welche Aussagen passen dazu?",
      "options": [
        {
          "id": "speed",
          "text": "Das Enzym beschleunigt die Reaktion."
        },
        {
          "id": "reuse",
          "text": "Das Enzym wird bei der Reaktion nicht verbraucht und kann erneut wirken."
        },
        {
          "id": "fuel",
          "text": "Das Enzym muss als Brennstoff verbraucht werden, damit die Reaktion schneller wird."
        },
        {
          "id": "all",
          "text": "Ein schneller wirkendes Enzym kann automatisch jede beliebige Stoffart spalten."
        }
      ],
      "correct": [
        "speed",
        "reuse"
      ],
      "explanation": "Enzyme beschleunigen passende chemische Reaktionen und werden dabei nicht verbraucht. Sie bleiben auf bestimmte Substrate spezialisiert. Schnelleres Arbeiten bedeutet nicht, dass jedes Substrat passt."
    },
    {
      "id": "bio009-protein-stations",
      "type": "mcq",
      "topic": "Eiweißverdauung zuordnen",
      "skills": [
        "digestion.proteins",
        "digestion.stomach",
        "digestion.intestines"
      ],
      "prompt": "Für ein Ablaufmodell werden Stationen der Eiweißverdauung beschriftet. Welche Beschriftungen stimmen?",
      "options": [
        {
          "id": "stomach",
          "text": "Magen: Pepsin spaltet Eiweiß in kleinere Eiweißstücke, die Peptide."
        },
        {
          "id": "intestine",
          "text": "Dünndarm: Weitere Enzyme zerlegen Eiweißstücke bis zu einzelnen Aminosäuren."
        },
        {
          "id": "blood",
          "text": "Dünndarmwand: Aminosäuren werden ins Blut aufgenommen."
        },
        {
          "id": "swap",
          "text": "Dünndarm: Pepsin übernimmt dort die abschließende Zerlegung zu Aminosäuren."
        },
        {
          "id": "product",
          "text": "Peptide sind ein anderer Name für das Enzym Pepsin."
        }
      ],
      "correct": [
        "stomach",
        "intestine",
        "blood"
      ],
      "explanation": "Pepsin wirkt im Magen und erzeugt kleinere Eiweißstücke. Andere Enzyme setzen die Verdauung im Dünndarm bis zu Aminosäuren fort. Die Aufnahme ins Blut folgt auf die Zerlegung; Enzym und Spaltprodukte sind verschiedene Dinge."
    },
    {
      "id": "bio009-surface-matching",
      "type": "mcq",
      "topic": "Oberflächen und Aufgaben",
      "skills": [
        "digestion.mouth",
        "digestion.intestines",
        "enzymes.action"
      ],
      "prompt": "Zwei Karten zeigen „Nahrung in viele kleine Stücke zerteilt“ und „Dünndarmwand mit vielen Zotten“. Welche Erklärungen passen?",
      "options": [
        {
          "id": "food",
          "text": "Die kleinen Nahrungsstücke bieten zusammen mehr zugängliche Oberfläche für Verdauungsenzyme."
        },
        {
          "id": "wall",
          "text": "Die Darmzotten bieten eine große Fläche für die Aufnahme von Nährstoffbausteinen."
        },
        {
          "id": "same",
          "text": "Beide Karten zeigen ausschließlich eine Vergrößerung der Nahrungsoberfläche."
        },
        {
          "id": "enzymes",
          "text": "Beim Zerteilen der Nahrung entstehen neue Enzymmoleküle."
        },
        {
          "id": "teeth",
          "text": "Durch das Kauen werden Bausteine unmittelbar durch die Zähne ins Blut aufgenommen."
        }
      ],
      "correct": [
        "food",
        "wall"
      ],
      "explanation": "Die Nahrungsoberfläche erleichtert den Kontakt mit Enzymen. Die Oberfläche der Dünndarmwand erleichtert die Aufnahme. Kauen vergrößert keine Darmwand und stellt keine Enzyme her."
    },
    {
      "id": "bio009-glucose-use",
      "type": "mcq",
      "topic": "Glucose in der Muskelzelle",
      "skills": [
        "metabolism.energy",
        "digestion.intestines"
      ],
      "prompt": "Eine Muskelzelle nutzt Glucose beim Radfahren zur Energieversorgung. Welche Aussagen erklären diesen Vorgang richtig?",
      "options": [
        {
          "id": "breakdown",
          "text": "Glucose wird in der Muskelzelle abgebaut."
        },
        {
          "id": "release",
          "text": "Dabei wird nutzbare Energie für die Muskelarbeit frei."
        },
        {
          "id": "transport",
          "text": "Allein der Transport von Glucose im Blut ist bereits ihr Abbau in der Muskelzelle."
        },
        {
          "id": "identity",
          "text": "Glucose und Energie sind zwei Wörter für denselben Stoff."
        }
      ],
      "correct": [
        "breakdown",
        "release"
      ],
      "explanation": "Glucose ist ein Stoff, dessen Abbau nutzbare Energie bereitstellt. Transport und Aufnahme bringen Glucose zur Zelle; sie sind vom anschließenden Abbau zu unterscheiden."
    },
    {
      "id": "bio009-building-after-uptake",
      "type": "mcq",
      "topic": "Bausteine verwenden",
      "skills": [
        "metabolism.building",
        "nutrients.roles"
      ],
      "prompt": "Aminosäuren aus einer Mahlzeit sind über das Blut zu Körperzellen gelangt. Welche Aussagen über ihre Verwendung stimmen?",
      "options": [
        {
          "id": "own",
          "text": "Zellen können daraus neue körpereigene Eiweiße aufbauen."
        },
        {
          "id": "energy",
          "text": "Der Aufbau körpereigener Eiweiße benötigt Energie."
        },
        {
          "id": "finished",
          "text": "Mit der Aufnahme ins Blut ist der Aufbau neuer Eiweiße bereits vollständig abgeschlossen."
        },
        {
          "id": "fat",
          "text": "Jede Aminosäure ist ein vollständiges Fettmolekül aus Glycerin und drei Fettsäuren."
        }
      ],
      "correct": [
        "own",
        "energy"
      ],
      "explanation": "Aufnahme und Transport liefern Bausteine. Erst in den Körperzellen können daraus neue körpereigene Eiweiße entstehen. Dieser Aufbaustoffwechsel benötigt Energie."
    },
    {
      "id": "bio009-speed-blank",
      "type": "frq",
      "topic": "Lücke: Enzymdefinition",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Ergänze das fehlende Verb: „Enzyme ___ chemische Reaktionen.“ Schreibe nur das fehlende Wort."
    },
    {
      "id": "bio009-protein-blanks",
      "type": "frq",
      "topic": "Lücken: Magen und Dünndarm",
      "skills": [
        "digestion.proteins",
        "digestion.stomach",
        "digestion.intestines"
      ],
      "prompt": "Ergänze die drei Lücken: „Im Magen spaltet das Enzym (1) ___ Eiweiß in kleinere Stücke, die (2) ___. Im Dünndarm entstehen bei der weiteren Zerlegung einzelne (3) ___.“ Schreibe nur 1–3 mit den passenden Wörtern."
    },
    {
      "id": "bio009-surface-blanks",
      "type": "frq",
      "topic": "Lücken: Welche Oberfläche?",
      "skills": [
        "digestion.mouth",
        "digestion.intestines"
      ],
      "prompt": "Ergänze jeweils, wessen Oberfläche gemeint ist: „Kauen vergrößert die zugängliche Oberfläche der (1) ___. Darmzotten vergrößern die Oberfläche der (2) ___.“ Schreibe nur 1 und 2 mit je einem oder wenigen Wörtern."
    },
    {
      "id": "bio009-energy-blanks",
      "type": "frq",
      "topic": "Lücken: Energie bereitstellen",
      "skills": [
        "metabolism.energy"
      ],
      "prompt": "Ergänze: „Zur Energieversorgung wird Glucose in Muskelzellen (1) ___. Dabei wird nutzbare (2) ___ frei.“ Schreibe nur 1 und 2 mit den passenden Wörtern."
    },
    {
      "id": "bio009-protection-blank",
      "type": "frq",
      "topic": "Lücke: Magenschutz",
      "skills": [
        "digestion.stomach"
      ],
      "prompt": "Ergänze den Namen der schützenden Auflage, nicht des Gewebes: „Die ___ liegt auf der Magenschleimhaut und schützt die Magenwand vor dem Magensaft.“ Schreibe nur den fehlenden Begriff."
    },
    {
      "id": "bio009-enzyme-explanation",
      "type": "frq",
      "topic": "Enzymwirkung begründen",
      "skills": [
        "enzymes.action"
      ],
      "prompt": "Ein Enzym hat ein passendes Stoffteilchen umgesetzt. Danach trifft es auf ein weiteres passendes und auf ein unpassendes Teilchen. Erkläre in etwa 3–4 Sätzen, wie das Enzym die Reaktionsgeschwindigkeit beeinflusst, warum es erneut wirken kann und warum es den unpassenden Stoff nicht umsetzt."
    },
    {
      "id": "bio009-protein-to-cell",
      "type": "frq",
      "topic": "Vom Eiweiß zum körpereigenen Stoff",
      "skills": [
        "digestion.proteins",
        "digestion.stomach",
        "digestion.intestines",
        "metabolism.building"
      ],
      "prompt": "Beschreibe den Weg von Eiweiß aus Quark bis zum Aufbau eines körpereigenen Eiweißes. Beginne im Magen und gehe über den Dünndarm und das Blut bis zur Körperzelle. Nenne, welche Stoffe an den einzelnen Stationen entstehen und wo Pepsin wirkt. Etwa 4–5 Sätze genügen."
    },
    {
      "id": "bio009-compare-two-changes",
      "type": "frq",
      "topic": "Zwei Veränderungen erklären",
      "skills": [
        "digestion.mouth",
        "digestion.intestines",
        "enzymes.action"
      ],
      "prompt": "Vergleiche zwei Veränderungen: Ein großes Brotstück wird in viele kleine Stücke zerkaut. Eine Dünndarmwand besitzt viele Zotten statt einer glatten Oberfläche. Erkläre für jede Veränderung, wessen Oberfläche größer ist und welcher Vorgang dadurch erleichtert wird. Schreibe etwa 3–4 Sätze."
    },
    {
      "id": "bio009-after-glucose-arrives",
      "type": "frq",
      "topic": "Nach der Aufnahme",
      "skills": [
        "metabolism.energy",
        "digestion.intestines"
      ],
      "prompt": "Glucose aus einer Mahlzeit ist bereits durch die Dünndarmwand ins Blut und von dort in eine Muskelzelle gelangt. Erkläre, was mit ihr zur Energieversorgung der Zelle geschieht und wofür die frei werdende Energie dienen kann. Warum erklärt der Satz „Die Glucose ist im Blut“ allein noch keine Energieversorgung der Muskelarbeit? Etwa 3 Sätze genügen."
    },
    {
      "id": "bio009-building-needs-energy",
      "type": "frq",
      "topic": "Aufbau und Energie verbinden",
      "skills": [
        "metabolism.building",
        "metabolism.energy",
        "nutrients.roles"
      ],
      "prompt": "Eine Zelle bekommt Aminosäuren und Glucose über das Blut. Erkläre, wie sie die Aminosäuren zum Aufbau nutzen und durch den Abbau von Glucose Energie dafür bereitstellen kann. Benenne die beiden Bereiche des Stoffwechsels und begründe, warum die Zelle für den Aufbau nicht nur Bausteine braucht. Etwa 3–4 Sätze genügen."
    }
  ],
  "testId": "biology-grade-8-2026-11",
  "canonicalPath": "../../../tests/biology-grade-8-2026-11/009-explain-the-missing-steps/"
};
