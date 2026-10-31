// Stable IDs identify questions/options. Change version whenever test content changes.
export const quiz = {
  id: 'biologie-demo', version: 2, language: 'de',
  title: 'Kleine Schritte. Großes Verstehen.',
  subtitle: 'Entdecke, was du schon weißt – und lerne bei jeder Antwort etwas dazu.',
  label: 'Biologie · Beispieltest',
  questions: [
    { id: 'cell', language: 'de', topic: 'Die Zelle', prompt: 'Welcher Bestandteil einer Pflanzenzelle ist mit A markiert?',
      image: { src: './assets/plant-cell.svg', alt: 'Schematische Pflanzenzelle. Der Pfeil A zeigt auf die dicke äußere Begrenzung, außerhalb der Zellmembran.' },
      options: [{id:'wall', text:'Die Zellwand'}, {id:'nucleus', text:'Der Zellkern'}, {id:'vacuole', text:'Die Vakuole'}, {id:'chloroplast', text:'Ein Chloroplast'}],
      correct: ['wall'], explanation: 'Die Zellwand liegt außerhalb der Zellmembran. Sie verleiht der Pflanzenzelle Stabilität und schützt sie.' },
    { id: 'photosynthesis', topic: 'Fotosynthese', prompt: 'Welche Stoffe benötigt eine Pflanze für die Fotosynthese?',
      options: [{id:'water',text:'Wasser'}, {id:'co2',text:'Kohlenstoffdioxid'}, {id:'oxygen',text:'Sauerstoff'}, {id:'sugar',text:'Traubenzucker'}],
      correct: ['water','co2'], explanation: 'Aus Wasser und Kohlenstoffdioxid entstehen mithilfe von Lichtenergie Traubenzucker und Sauerstoff. Licht liefert Energie, ist aber kein Stoff.' },
    { id: 'digestion', topic: 'Verdauung', prompt: 'Welches Organ gehört an die Stelle des Fragezeichens?',
      mermaid: 'flowchart LR\n A["Mund"] --> B["Speiseröhre"] --> C["?"] --> D["Dünndarm"] --> E["Dickdarm"]',
      diagramDescription: 'Reihenfolge im Verdauungstrakt: Mund, Speiseröhre, gesuchtes Organ, Dünndarm, Dickdarm.',
      options: [{id:'stomach',text:'Magen'}, {id:'liver',text:'Leber'}, {id:'pancreas',text:'Bauchspeicheldrüse'}, {id:'lung',text:'Lunge'}],
      correct: ['stomach'], explanation: 'Die Nahrung gelangt durch die Speiseröhre in den Magen. Dort wird sie durchmischt, bevor sie in den Dünndarm weitertransportiert wird.' },
    { id: 'enzymes', topic: 'Stoffwechsel', prompt: 'Welche Aussagen über Enzyme sind richtig?',
      options: [{id:'speed',text:'Sie beschleunigen chemische Reaktionen.'}, {id:'specific',text:'Sie wirken meist auf bestimmte Substrate.'}, {id:'used',text:'Sie werden bei jeder Reaktion verbraucht.'}, {id:'heat',text:'Sie arbeiten bei jeder Temperatur gleich gut.'}],
      correct: ['speed','specific'], explanation: 'Enzyme wirken als Biokatalysatoren und sind meist substratspezifisch. Sie werden bei der Reaktion nicht verbraucht. Ihre Aktivität hängt unter anderem von der Temperatur ab.' },
    { id: 'absorption', topic: 'Verdauung', prompt: 'Wo wird der größte Teil der Nährstoffe in den Körper aufgenommen?',
      options: [{id:'small',text:'Im Dünndarm'}, {id:'mouth',text:'Im Mund'}, {id:'stomach',text:'Im Magen'}, {id:'esophagus',text:'In der Speiseröhre'}],
      correct: ['small'], explanation: 'Der Dünndarm besitzt durch Falten, Zotten und Mikrovilli eine sehr große Oberfläche. Über sie werden die meisten Nährstoffe aufgenommen.' },
    { id: 'frq-digestion', type: 'frq', topic: 'Verdauung', language: 'de',
      prompt: 'Erkläre in eigenen Worten, warum die große Oberfläche des Dünndarms für die Aufnahme von Nährstoffen wichtig ist.' },
    { id: 'frq-plants', type: 'frq', topic: 'Fotosynthese', language: 'de',
      prompt: 'Eine Pflanze steht mehrere Tage im Dunkeln. Beschreibe, wie sich das auf ihre Fotosynthese auswirkt, und begründe deine Antwort.' }

  ]
};
