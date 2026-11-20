// Contenus des 7 nouveaux jeux de Fuzo.

/* ---------- Quiz : c = catégorie, o[0] = bonne réponse (mélangée à l'affichage) ---------- */
export const QUIZCATS = {
  af: { n: 'Afrique', e: 'globe2', c: '#e0a32e', d: 'Capitales, histoire, musique, sport' },
  ca: { n: 'Canada', e: 'flag', c: '#d65a5a', d: 'Ottawa, Québec, expressions…' },
  mo: { n: 'Monde & culture', e: 'globe', c: '#3d6fc4', d: 'Culture générale, sciences, Lyon' },
  mix: { n: 'Grand mélange', e: 'shuffle', c: '#8d7bea', d: 'Un peu de tout' },
};
const q = (c, s) => s.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [qq, ...o] = l.split(' | '); return { c, q: qq, o }; });
export const QUIZ = [
  ...q('af', `
Quelle est la capitale officielle du Bénin ? | Porto-Novo | Cotonou | Parakou | Abomey
Comment s'appelait le Bénin avant 1975 ? | Le Dahomey | La Haute-Volta | La Gold Coast | Le Zaïre
En quelle année le Bénin est-il devenu indépendant ? | 1960 | 1958 | 1965 | 1975
Dans quelle ville béninoise se trouve la « Porte du Non-Retour » ? | Ouidah | Abomey | Natitingou | Bohicon
Ganvié, célèbre village sur pilotis, se trouve sur… | Le lac Nokoué | Le lac Victoria | Le lac Tchad | Le lac Kivu
Les palais royaux classés à l'UNESCO au Bénin sont à… | Abomey | Porto-Novo | Djougou | Kandi
Les « Agojie » du royaume du Dahomey étaient… | Des guerrières | Des marchandes | Des musiciennes | Des prêtresses
Angélique Kidjo, star mondiale de la musique, est née au… | Bénin | Togo | Nigeria | Cameroun
La langue fon est surtout parlée au… | Bénin | Sénégal | Kenya | Gabon
Quelle est la capitale du Sénégal ? | Dakar | Saint-Louis | Thiès | Bamako
Quelle est la capitale officielle de la Côte d'Ivoire ? | Yamoussoukro | Abidjan | Bouaké | San-Pédro
Quelle est la capitale du Nigeria ? | Abuja | Lagos | Kano | Ibadan
Quelle est la capitale du Ghana ? | Accra | Kumasi | Lomé | Tamale
Quelle est la capitale du Togo ? | Lomé | Kara | Accra | Sokodé
Quelle est la capitale du Burkina Faso ? | Ouagadougou | Bobo-Dioulasso | Niamey | Bamako
Quelle est la capitale du Mali ? | Bamako | Tombouctou | Mopti | Dakar
Quelle est la capitale du Niger ? | Niamey | Zinder | Agadez | N'Djamena
Quelle est la capitale du Cameroun ? | Yaoundé | Douala | Garoua | Bafoussam
Quelle est la capitale du Gabon ? | Libreville | Port-Gentil | Franceville | Malabo
Quelle est la capitale de la République démocratique du Congo ? | Kinshasa | Lubumbashi | Brazzaville | Goma
Quelle est la capitale de la République du Congo ? | Brazzaville | Pointe-Noire | Kinshasa | Bangui
Quelle est la capitale du Kenya ? | Nairobi | Mombasa | Kampala | Kisumu
Quelle est la capitale de l'Éthiopie ? | Addis-Abeba | Asmara | Djibouti | Gondar
Quelle est la capitale du Maroc ? | Rabat | Casablanca | Marrakech | Fès
Quelle est la capitale de Madagascar ? | Antananarivo | Toamasina | Mahajanga | Moroni
Quelle est la capitale du Rwanda ? | Kigali | Butare | Bujumbura | Kampala
Quelle est la capitale de la Guinée ? | Conakry | Kankan | Bissau | Freetown
Quelle est la capitale de l'Angola ? | Luanda | Huambo | Maputo | Lusaka
Quel est le plus long fleuve d'Afrique ? | Le Nil | Le Congo | Le Niger | Le Zambèze
Quel est le plus haut sommet d'Afrique ? | Le Kilimandjaro | Le mont Kenya | Le mont Cameroun | Le Toubkal
Quel est le pays le plus peuplé d'Afrique ? | Le Nigeria | L'Éthiopie | L'Égypte | La RDC
Quel est le plus grand pays d'Afrique par sa superficie ? | L'Algérie | La RDC | Le Soudan | La Libye
Quelle monnaie partagent le Bénin, le Sénégal et la Côte d'Ivoire ? | Le franc CFA | Le naira | Le cedi | Le dirham
Quelle est la monnaie du Nigeria ? | Le naira | Le rand | Le cedi | Le shilling
Quelle est la monnaie de l'Afrique du Sud ? | Le rand | Le dollar | Le kwacha | La livre
Comment s'appelait le Burkina Faso avant 1984 ? | La Haute-Volta | Le Dahomey | Le Soudan français | L'Oubangui-Chari
Comment s'appelait la RDC entre 1971 et 1997 ? | Le Zaïre | Le Katanga | Le Congo belge | L'Oubangui
Comment s'appelait le Ghana avant son indépendance ? | La Côte-de-l'Or | La Côte-des-Esclaves | La Côte-d'Ivoire | La Côte-des-Graines
Qui fut le premier président noir de l'Afrique du Sud ? | Nelson Mandela | Desmond Tutu | Thabo Mbeki | Jacob Zuma
Qui a fondé l'Empire du Mali au XIIIe siècle ? | Soundiata Keïta | Mansa Moussa | Sonni Ali | Samory Touré
Mansa Moussa, empereur du Mali, est resté célèbre pour… | Son immense richesse | Ses poèmes | Ses inventions | Ses navires
L'afrobeat a été créé par… | Fela Kuti | Youssou N'Dour | Salif Keïta | Manu Dibango
Le coupé-décalé est né en… | Côte d'Ivoire | Afrique du Sud | Égypte | Éthiopie
Youssou N'Dour est un chanteur originaire du… | Sénégal | Mali | Ghana | Bénin
Qui surnommait-on « Mama Africa » ? | Miriam Makeba | Oumou Sangaré | Aya Nakamura | Cesária Évora
Le célèbre « Soul Makossa » est un titre de… | Manu Dibango | Fela Kuti | Papa Wemba | Alpha Blondy
Quel instrument à cordes est emblématique des griots d'Afrique de l'Ouest ? | La kora | Le djembé | Le balafon | La sanza
George Weah, Ballon d'Or 1995, est devenu président de quel pays ? | Le Liberia | Le Ghana | La Sierra Leone | Le Cameroun
Didier Drogba est une légende du football de… | Côte d'Ivoire | Cameroun | Sénégal | Nigeria
Samuel Eto'o a joué pour la sélection du… | Cameroun | Gabon | Togo | Ghana
Quel pays a remporté la CAN 2023, jouée début 2024 à domicile ? | La Côte d'Ivoire | Le Nigeria | Le Sénégal | L'Égypte
Quel est le premier pays africain à atteindre les demi-finales d'une Coupe du monde ? | Le Maroc | Le Cameroun | Le Ghana | Le Sénégal
Quel pays africain a accueilli la Coupe du monde de football 2010 ? | L'Afrique du Sud | Le Maroc | L'Égypte | Le Nigeria
Le célèbre plat « attiéké » est préparé à base de… | Manioc | Riz | Mil | Igname
Le thiéboudienne, plat national à base de riz et de poisson, vient du… | Sénégal | Kenya | Maroc | Cameroun
L'injera, grande galette souple, est typique de… | L'Éthiopie | Le Mali | L'Algérie | Le Gabon
Le riz « jollof » est l'objet d'une rivalité amicale entre le Ghana et… | Le Nigeria | Le Togo | Le Bénin | Le Mali
Le tissu kente, aux couleurs vives, est originaire du… | Ghana | Maroc | Madagascar | Rwanda
Qui fut la première femme africaine Prix Nobel de la paix ? | Wangari Maathai | Ellen Johnson Sirleaf | Leymah Gbowee | Graça Machel
Wole Soyinka, Prix Nobel de littérature 1986, est… | Nigérian | Sénégalais | Kényan | Sud-Africain
Où se trouve le siège de l'Union africaine ? | Addis-Abeba | Dakar | Nairobi | Abuja
Quelle langue sert de langue commune dans une grande partie de l'Afrique de l'Est ? | Le swahili | Le haoussa | Le wolof | Le lingala
En Côte d'Ivoire, « Akwaba » veut dire… | Bienvenue | Merci | Au revoir | Bon appétit
Quel festival de cinéma africain se tient à Ouagadougou ? | Le FESPACO | Le FIFA | Les JCC | Le MASA
« Nollywood » désigne le cinéma de quel pays ? | Le Nigeria | Le Niger | Le Kenya | La Namibie
Les lémuriens vivent à l'état sauvage uniquement à… | Madagascar | Maurice | Zanzibar | Sao Tomé
Les chutes Victoria se trouvent entre la Zambie et… | Le Zimbabwe | La Tanzanie | Le Malawi | L'Angola
Lequel de ces pays borde le lac Victoria ? | L'Ouganda | Le Ghana | La Zambie | Le Mali
Le canal de Suez relie la Méditerranée et… | La mer Rouge | La mer Noire | L'océan Atlantique | Le golfe de Guinée
La Grande Mosquée de Djenné, plus grand édifice en terre crue du monde, est au… | Mali | Niger | Tchad | Sénégal
En quelle année de nombreux pays d'Afrique ont-ils obtenu leur indépendance, si bien qu'on l'appelle « l'année de l'Afrique » ? | 1960 | 1945 | 1975 | 1990
Le marathonien Eliud Kipchoge est originaire du… | Kenya | Éthiopie | Ouganda | Maroc
Mohamed Salah joue pour la sélection de… | L'Égypte | La Tunisie | Le Maroc | L'Algérie
Sadio Mané est un footballeur… | Sénégalais | Guinéen | Malien | Gambien
`),
  ...q('ca', `
Quelle est la capitale du Canada ? | Ottawa | Toronto | Montréal | Vancouver
Dans quelle province se trouve Ottawa ? | L'Ontario | Le Québec | Le Manitoba | La Nouvelle-Écosse
Quelle ville se trouve juste en face d'Ottawa, de l'autre côté de la rivière ? | Gatineau | Kingston | Laval | Sherbrooke
Quelle rivière sépare Ottawa de Gatineau ? | La rivière des Outaouais | Le Saint-Laurent | La rivière Rouge | Le Niagara
L'hiver, le canal Rideau à Ottawa devient… | Une immense patinoire | Une piste de ski | Un marché de Noël | Une route
Chaque printemps, Ottawa fête quelles fleurs offertes par les Pays-Bas ? | Les tulipes | Les roses | Les tournesols | Les lilas
À Ottawa, une « queue de castor » est… | Une pâtisserie frite | Une rame de canoë | Un chapeau | Un poisson
Comment s'appelle le festival d'hiver d'Ottawa ? | Le Bal de neige | Le Carnaval de Québec | Les Glaces d'or | La Fête du froid
Quelle est la plus grande ville du Canada ? | Toronto | Montréal | Vancouver | Calgary
Quelles sont les langues officielles du Canada ? | L'anglais et le français | L'anglais seulement | Le français et l'inuktitut | L'anglais et l'espagnol
Quelle est la seule province officiellement bilingue ? | Le Nouveau-Brunswick | Le Québec | L'Ontario | Le Manitoba
Quelle feuille figure sur le drapeau canadien ? | L'érable | Le chêne | Le bouleau | Le sapin
Combien de provinces compte le Canada ? | 10 | 8 | 12 | 13
Combien de territoires compte le Canada ? | 3 | 2 | 4 | 5
Quand se fête la fête du Canada ? | Le 1er juillet | Le 14 juillet | Le 24 juin | Le 1er mai
Comment surnomme-t-on la pièce canadienne de 1 dollar ? | Le huard | Le castor | L'orignal | L'érable
Quel animal est un emblème national du Canada ? | Le castor | L'aigle | Le loup | Le caribou
Quel plat québécois associe frites, fromage en grains et sauce ? | La poutine | La tourtière | Le pâté chinois | La bannique
Quelle province produit la majorité du sirop d'érable mondial ? | Le Québec | L'Ontario | L'Alberta | Le Yukon
Dans quelle ville se trouve la Tour CN ? | Toronto | Ottawa | Montréal | Winnipeg
Les chutes du Niagara sont à la frontière entre l'Ontario et… | L'État de New York | Le Québec | Le Michigan | Le Vermont
Le Canada est le … plus grand pays du monde par sa superficie. | 2e | 1er | 3e | 5e
Combien d'océans bordent le Canada ? | 3 | 2 | 1 | 4
Quel est le sport national d'hiver du Canada ? | Le hockey sur glace | Le curling | Le ski | Le patinage
Quel sport a été inventé par le Canadien James Naismith ? | Le basketball | Le volleyball | Le hockey | Le baseball
Quelle équipe canadienne a remporté le titre NBA en 2019 ? | Les Raptors de Toronto | Les Grizzlies | Les Canadiens | Les Jets
Qui surnomme-t-on « The Great One » au hockey ? | Wayne Gretzky | Sidney Crosby | Mario Lemieux | Maurice Richard
Céline Dion est originaire de quelle province ? | Le Québec | L'Ontario | La Saskatchewan | L'Alberta
Dans quelle ville ont grandi les rappeurs Drake et The Weeknd ? | Toronto | Montréal | Vancouver | Ottawa
Le Cirque du Soleil a été fondé au… | Québec | Nevada | France | Ontario
Qui a fondé la ville de Québec en 1608 ? | Samuel de Champlain | Jacques Cartier | Louis XIV | La Salle
Quelle est la capitale de la province de Québec ? | Québec | Montréal | Trois-Rivières | Gatineau
Quelle est la capitale de la Colombie-Britannique ? | Victoria | Vancouver | Kelowna | Surrey
Dans quelle province se trouve le parc national de Banff ? | L'Alberta | La Colombie-Britannique | Le Yukon | Le Manitoba
Quel territoire, créé en 1999, est majoritairement peuplé d'Inuits ? | Le Nunavut | Le Yukon | Les Territoires du Nord-Ouest | Le Labrador
Un « inukshuk » est… | Un empilement de pierres | Un bateau | Un igloo | Un chant
Au Québec, « magasiner » veut dire… | Faire les boutiques | Ranger | Travailler dur | Cuisiner
Au Québec, un « char » c'est… | Une voiture | Un chat | Un chariot | Un vélo
Au Québec, ta « blonde » c'est… | Ta copine | Ta sœur | Ta bière | Ta voisine
Au Québec, une « tuque » c'est… | Un bonnet | Une écharpe | Une bottine | Un manteau
Au Québec, un « dépanneur » c'est… | Une petite épicerie | Un garagiste | Un taxi | Un plombier
Au Québec, « c'est plate » veut dire… | C'est ennuyeux | C'est facile | C'est bon marché | C'est bien rangé
Au Québec, « avoir de la misère » veut dire… | Avoir du mal à faire quelque chose | Être pauvre | Être malade | Avoir froid
En hiver, quand il est 20 h à Lyon, quelle heure est-il à Ottawa ? | 14 h | 13 h | 15 h | 2 h
Qui est le chef d'État du Canada ? | Le roi Charles III | Le président du Canada | Le gouverneur de l'Ontario | Le maire d'Ottawa
Quelle découverte médicale majeure a été faite à Toronto en 1921 ? | L'insuline | La pénicilline | Le vaccin de la rage | Les rayons X
Quel pays possède le plus long littoral du monde ? | Le Canada | La Russie | L'Australie | L'Indonésie
Comment s'appelle l'hymne national du Canada ? | Ô Canada | God Save Canada | Terre de nos aïeux | Mon pays
`),
  ...q('mo', `
Quelle planète est la plus proche du Soleil ? | Mercure | Vénus | Mars | Terre
Quel est le plus grand océan du monde ? | Le Pacifique | L'Atlantique | L'Indien | L'Arctique
Combien d'os compte le corps d'un adulte ? | 206 | 180 | 250 | 312
Qui a peint la Joconde ? | Léonard de Vinci | Michel-Ange | Picasso | Van Gogh
Quelle est la monnaie du Japon ? | Le yen | Le won | Le yuan | Le baht
Quel est le plus haut sommet du monde ? | L'Everest | Le K2 | Le mont Blanc | L'Aconcagua
Quelle est la capitale de l'Australie ? | Canberra | Sydney | Melbourne | Perth
Quelle est la capitale du Brésil ? | Brasília | Rio de Janeiro | São Paulo | Salvador
Quelle est la capitale de la Turquie ? | Ankara | Istanbul | Izmir | Antalya
Quel élément chimique a pour symbole « Au » ? | L'or | L'argent | L'aluminium | Le cuivre
Combien y a-t-il de minutes dans une journée ? | 1 440 | 1 200 | 2 400 | 3 600
Quel est le plus grand animal du monde ? | La baleine bleue | L'éléphant d'Afrique | Le requin-baleine | La girafe
Combien de cœurs possède une pieuvre ? | 3 | 1 | 2 | 8
Quel est le plus grand organe du corps humain ? | La peau | Le foie | Les poumons | Le cerveau
Quel gaz les plantes absorbent-elles pour vivre ? | Le dioxyde de carbone | L'oxygène | L'hélium | L'azote
Qui a écrit « Les Misérables » ? | Victor Hugo | Émile Zola | Molière | Albert Camus
Qui a écrit « Le Petit Prince » ? | Antoine de Saint-Exupéry | Jules Verne | Jean de La Fontaine | Marcel Pagnol
En quelle année la tour Eiffel a-t-elle été inaugurée ? | 1889 | 1789 | 1900 | 1925
Lyon est traversée par le Rhône et… | La Saône | La Loire | La Seine | La Garonne
À quelle date a lieu le cœur de la Fête des Lumières à Lyon ? | Le 8 décembre | Le 31 octobre | Le 14 juillet | Le 1er janvier
Quels Lyonnais ont inventé le cinématographe ? | Les frères Lumière | Les frères Pathé | Les frères Montgolfier | Les frères Wright
À Lyon, un « bouchon » c'est… | Un restaurant traditionnel | Un embouteillage | Un pont | Une fête
À Lyon, quelle colline est surnommée « la colline qui travaille » ? | La Croix-Rousse | Fourvière | Montmartre | Saint-Just
Où ont eu lieu les Jeux olympiques d'été 2024 ? | Paris | Los Angeles | Tokyo | Londres
Quels pays ont organisé ensemble la Coupe du monde de football 2026 ? | Canada, États-Unis, Mexique | Maroc, Espagne, Portugal | Brésil, Argentine, Chili | France, Belgique, Suisse
Combien de joueurs par équipe sur un terrain de football ? | 11 | 10 | 9 | 12
De quel pays vient le reggae ? | La Jamaïque | Cuba | Le Brésil | Haïti
Qui surnomme-t-on « le roi de la pop » ? | Michael Jackson | Elvis Presley | Prince | Stevie Wonder
Quel est le plus petit pays du monde ? | Le Vatican | Monaco | Saint-Marin | Malte
En quelle année est tombé le mur de Berlin ? | 1989 | 1979 | 1991 | 1968
Qui fut le premier homme à marcher sur la Lune ? | Neil Armstrong | Youri Gagarine | Buzz Aldrin | Thomas Pesquet
Combien de pattes a une araignée ? | 8 | 6 | 10 | 12
Combien de couleurs compte-t-on traditionnellement dans un arc-en-ciel ? | 7 | 5 | 6 | 9
Où le web (WWW) a-t-il été inventé ? | Au CERN, près de Genève | À la NASA | Chez Apple | À Stanford
Quel est le pays le plus peuplé du monde depuis 2023 ? | L'Inde | La Chine | Les États-Unis | L'Indonésie
Quel est le désert le plus aride du monde (hors pôles) ? | L'Atacama | Le Sahara | Le Gobi | Le Kalahari
Combien de temps dure un match NBA (temps de jeu) ? | 48 minutes | 40 minutes | 60 minutes | 90 minutes
Quel pays a inventé les sushis tels qu'on les connaît ? | Le Japon | La Chine | La Corée | La Thaïlande
La paella est un plat originaire… | D'Espagne | D'Italie | Du Portugal | Du Mexique
Quelle est la langue maternelle la plus parlée au monde ? | Le mandarin | L'anglais | L'espagnol | L'hindi
Quel est l'animal terrestre le plus rapide ? | Le guépard | Le lion | L'antilope | Le cheval
Quelle planète est surnommée « la planète rouge » ? | Mars | Jupiter | Saturne | Vénus
Combien de secondes y a-t-il dans une heure ? | 3 600 | 360 | 6 000 | 1 000
Dans quel pays se trouvent les pyramides de Gizeh ? | L'Égypte | Le Soudan | Le Mexique | La Jordanie
À quelle température l'eau bout-elle au niveau de la mer ? | 100 °C | 90 °C | 120 °C | 80 °C
Quel est le symbole chimique de l'eau ? | H₂O | CO₂ | O₂ | NaCl
Quel pays a la forme d'une botte ? | L'Italie | La Grèce | Le Chili | Le Portugal
Combien de joueurs dans une équipe de basket sur le terrain ? | 5 | 6 | 7 | 4
Qui a composé « La Lettre à Élise » ? | Beethoven | Mozart | Bach | Chopin
Combien de jours compte une année bissextile ? | 366 | 365 | 364 | 360
`),
];

/* ---------- Mot Interdit : w = mot à faire deviner, f = mots interdits ---------- */
const t = s => s.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [w, f] = l.split(' : '); return { w, f: f.split(', ') }; });
export const TABOU = t(`
Plage : sable, mer, vacances, soleil
Pizza : italien, fromage, four, pâte
Téléphone : appeler, portable, écran, sonner
Avion : voler, aéroport, pilote, ciel
Cinéma : film, salle, écran, popcorn
Anniversaire : gâteau, bougies, âge, fête
Chocolat : cacao, sucré, noir, tablette
Neige : blanc, froid, hiver, flocon
Café : boire, tasse, noir, matin
Football : ballon, but, équipe, match
Dentiste : dents, carie, docteur, bouche
Mariage : épouser, robe, alliance, couple
Lune : nuit, ciel, croissant, étoile
Parapluie : pluie, mouillé, ouvrir, protéger
Boulanger : pain, croissant, baguette, four
Montagne : sommet, ski, haut, randonnée
Guitare : cordes, musique, jouer, instrument
Banane : jaune, fruit, singe, éplucher
Hôpital : malade, médecin, soigner, infirmière
Valise : voyage, bagage, vêtements, aéroport
Lunettes : yeux, voir, verres, nez
Réveil : matin, sonner, dormir, heure
Facture : payer, argent, électricité, mois
Tortue : lente, carapace, animal, lièvre
Clé : porte, serrure, ouvrir, maison
Miroir : reflet, regarder, glace, se voir
Bougie : flamme, cire, allumer, lumière
Pompier : feu, camion, rouge, éteindre
Douche : eau, laver, salle de bain, savon
Livre : lire, pages, auteur, histoire
Cadeau : offrir, paquet, Noël, anniversaire
Glace : froid, dessert, cornet, parfum
Chien : aboyer, animal, os, niche
Bébé : pleurer, couche, petit, naissance
École : élève, professeur, classe, apprendre
Taxi : voiture, chauffeur, course, payer
Restaurant : manger, serveur, menu, table
Piscine : nager, eau, maillot, plonger
Ordinateur : écran, clavier, souris, internet
Hiver : froid, neige, saison, décembre
Ananas : fruit, jaune, tropical, piquant
Moustique : piquer, insecte, été, bzz
Fantôme : peur, drap, mort, hanter
Pirate : bateau, trésor, perroquet, mer
Selfie : photo, téléphone, soi-même, Instagram
WhatsApp : message, appli, vert, discuter
Netflix : série, film, regarder, abonnement
Vacances : congé, partir, repos, été
Embouteillage : voitures, bouchon, route, bloqué
Sieste : dormir, après-midi, lit, fatigué
Pluie : eau, nuage, mouillé, parapluie
Arc-en-ciel : couleurs, pluie, soleil, ciel
Licorne : corne, cheval, magique, arc-en-ciel
Vampire : sang, dents, Dracula, nuit
Sorcière : balai, magie, chapeau, potion
Marché : acheter, légumes, vendeurs, étals
Coiffeur : cheveux, couper, salon, ciseaux
Tresses : cheveux, coiffure, natter, rajouts
Jollof : riz, tomate, Ghana, Nigeria
Alloco : banane, plantain, frit, Côte d'Ivoire
Pagne : tissu, wax, Afrique, couturier
Zémidjan : moto, taxi, Cotonou, conducteur
Maquis : restaurant, Afrique, bière, poulet
Djembé : tambour, percussion, taper, Afrique
Griot : chanteur, histoire, Afrique de l'Ouest, conteur
Érable : arbre, sirop, feuille, Canada
Hockey : glace, crosse, palet, patins
Igloo : glace, maison, Inuit, neige
Poutine : frites, fromage, sauce, Québec
Castor : animal, barrage, dents, bois
Ottawa : capitale, Canada, Ontario, ville
Lyon : ville, France, Rhône, bouchon
Tour Eiffel : Paris, monument, fer, haute
Montgolfière : ballon, air chaud, voler, nacelle
Fusée : espace, lancer, astronaute, Lune
Robot : machine, métal, intelligence, programme
Volcan : lave, éruption, montagne, cratère
Désert : sable, chaud, chameau, Sahara
Requin : poisson, dents, mer, dangereux
Abeille : miel, piquer, insecte, ruche
Escargot : coquille, lent, baver, limace
Papillon : ailes, insecte, chenille, voler
Girafe : cou, long, tachetée, savane
Éléphant : trompe, défenses, gros, Afrique
Lion : roi, crinière, savane, rugir
Serpent : ramper, venin, siffler, reptile
Poulet : volaille, rôti, œuf, cuisse
Omelette : œufs, poêle, cuire, battre
Spaghetti : pâtes, longues, sauce, Italie
Frites : pommes de terre, huile, McDo, cuire
Sushi : riz, poisson, Japon, cru
Crêpe : poêle, farine, Chandeleur, sucre
Thé : boire, tasse, infusion, chaud
Jus : fruit, boire, orange, presser
Cuisine : cuisiner, pièce, four, recette
Canapé : s'asseoir, salon, coussins, sofa
Oreiller : dormir, lit, tête, plume
Couverture : lit, chaud, couvrir, dormir
Frigo : froid, cuisine, aliments, conserver
Micro-ondes : réchauffer, cuisine, bip, plat
Ascenseur : étage, monter, descendre, bouton
Escalier : marches, monter, étage, rampe
Vélo : pédaler, roues, guidon, rouler
Train : rails, gare, wagon, SNCF
Métro : souterrain, rame, station, ville
Passeport : voyage, frontière, identité, visa
Soleil : chaud, jour, lumière, étoile
Étoile : ciel, nuit, briller, filante
Nuage : ciel, gris, pluie, blanc
Orage : éclair, tonnerre, pluie, bruit
Vent : souffler, air, tempête, éolienne
Rêve : dormir, nuit, songe, cauchemar
Bisou : embrasser, joue, lèvres, smack
Câlin : bras, serrer, tendresse, étreinte
Secret : cacher, dire, personne, confidence
Mensonge : faux, vérité, mentir, Pinocchio
Rire : drôle, blague, sourire, mdr
Larmes : pleurer, yeux, triste, couler
Peur : effrayé, frisson, crier, horreur
Jalousie : jaloux, envie, couple, possessif
Patience : attendre, calme, temps, impatient
Courage : brave, peur, héros, oser
Président : pays, élu, chef, gouvernement
Policier : police, arrêter, uniforme, voleur
Professeur : école, enseigner, élèves, cours
Médecin : malade, soigner, docteur, ordonnance
Avocat : tribunal, défendre, juge, fruit
Chanteur : chanter, voix, micro, concert
Footballeur : ballon, joueur, but, club
Influenceur : réseaux, abonnés, Instagram, vidéo
Banquier : banque, argent, compte, prêt
Cuisinier : cuisine, chef, plats, restaurant
Facteur : courrier, lettres, boîte, poste
Agriculteur : ferme, champ, tracteur, récolte
Pharmacie : médicaments, croix verte, ordonnance, pharmacien
Supermarché : courses, caddie, caisse, rayons
Banque : argent, compte, carte, conseiller
Musée : tableaux, art, visiter, exposition
Zoo : animaux, cages, visiter, gardien
Parc : arbres, banc, promenade, jardin
Église : messe, prier, curé, cloche
Prison : détenu, cellule, barreaux, enfermé
Aéroport : avion, décoller, valise, vol
Concert : musique, scène, chanteur, public
Karaoké : chanter, paroles, micro, écran
Carte bancaire : payer, code, banque, puce
Clavier : touches, taper, ordinateur, lettres
Casque : oreilles, musique, écouter, tête
Montre : heure, poignet, aiguilles, temps
Sac à dos : dos, porter, école, randonnée
Chaussures : pieds, lacets, porter, baskets
Chapeau : tête, porter, soleil, casquette
Écharpe : cou, froid, laine, hiver
Robe : fille, porter, vêtement, soirée
Costume : veste, cravate, homme, mariage
Parfum : odeur, sentir, flacon, vaporiser
Maquillage : visage, rouge à lèvres, fond de teint, se maquiller
Barbe : poils, menton, raser, homme
Tatouage : encre, peau, dessin, aiguille
Sport : courir, muscles, entraînement, salle
Marathon : courir, 42 kilomètres, course, coureur
Boxe : gants, frapper, ring, combat
Échecs : roi, reine, plateau, mat
Cartes : jouer, as, jeu, battre
Loto : numéros, gagner, tirage, millions
Noël : sapin, cadeaux, décembre, Père Noël
Halloween : citrouille, déguisement, bonbons, peur
Saint-Valentin : amoureux, février, cœur, 14
Nouvel An : minuit, 31 décembre, fête, année
`);

/* ---------- Le Mensonge : thèmes ---------- */
export const MENS = [
  ['Ton enfance', 'Un souvenir, une bêtise, un jouet…'], ['La nourriture', 'Ce que tu adores, détestes, as déjà goûté…'], ['Tes voyages', 'Des pays, des galères, des surprises…'],
  ["L'école", 'Profs, notes, punitions, amitiés…'], ['Tes talents cachés', 'Ce que tu sais faire (ou pas)…'], ['Tes peurs', 'Bêtes, situations, phobies bizarres…'],
  ['Ta famille', 'Anecdotes, traditions, cousins…'], ['Tes premières fois', 'Premier job, premier concert, premier voyage…'], ['Le travail', 'Jobs, collègues, situations insolites…'],
  ['Les animaux', 'Animaux que tu as eus, croisés, redoutés…'], ['La musique', 'Concerts, chansons honteuses, instruments…'], ['Le sport', 'Exploits, blessures, sports essayés…'],
  ['Tes bêtises', 'Ce que tu as fait sans te faire prendre…'], ['Ton téléphone', 'Applis, photos, messages gênants…'], ['Les fêtes', 'Anniversaires, mariages, soirées mémorables…'],
  ['Ta chambre', 'Ce qui traîne, ce qui est caché…'], ['Les films et séries', 'Ce que tu as vu 10 fois, ce qui te fait pleurer…'], ['Les rencontres', 'Des gens connus, des rencontres improbables…'],
  ['Tes habitudes', 'Matin, soir, manies étranges…'], ['Tes rêves', 'Rêves de nuit ou rêves de vie…'], ["L'argent", 'Achats fous, économies, trouvailles…'],
  ['Les vêtements', 'Looks ratés, pièce préférée, couleurs…'], ['La cuisine', 'Recettes réussies, catastrophes, spécialités…'], ['Les transports', 'Avions ratés, trajets fous, permis…'],
  ['Le corps', 'Cicatrices, allergies, records…'], ['Les réseaux sociaux', 'Comptes, posts, stalkings…'], ['La météo', 'Canicules, tempêtes, neige…'],
  ['Les records perso', "Le plus loin, le plus tard, le plus d'heures…"], ['Les jeux', 'Jeux vidéo, jeux de société, triches…'], ['Les célébrités', 'Croisées, admirées, détestées…'],
  ['Ta ville natale', 'Lieux, gens, souvenirs…'], ['Le sommeil', 'Somnambulisme, records, rêves…'], ['Les langues', 'Ce que tu parles, comprends, prétends parler…'],
  ['Les accidents', 'Chutes, pannes, moments gênants…'], ['Les cadeaux', 'Les plus beaux, les pires, les ratés…'], ['Tes amis', 'Anecdotes, disputes, aventures…'],
  ['Les études', 'Diplômes, examens, mémoires…'], ['Les superstitions', "Ce que tu crois (ou pas)…"], ['Les objets fétiches', 'Ce que tu gardes depuis des années…'],
  ["L'avenir", 'Projets, envies, folies que tu vas faire…'],
];
// Kobi : s = 3 affirmations, l = index du mensonge
export const MENS_BOT = [
  { s: ['Je ne dors jamais.', "J'ai déjà perdu une partie de Puissance 4.", 'Je rêve de voir la neige à Ottawa.'], l: 1 },
  { s: ["Ma couleur préférée, c'est le bleu.", "J'ai peur des aspirateurs.", 'Je compte en binaire quand je stresse.'], l: 2 },
  { s: ["J'ai été construit à Lyon.", 'Je connais 435 mots de 5 lettres.', "Mon plat préféré, c'est le jollof."], l: 0 },
  { s: ["Je n'ai jamais pris l'avion.", "J'ai un cousin grille-pain.", 'Je chante sous la douche.'], l: 2 },
  { s: ['Je triche parfois au Morpion.', "Mon prénom vient d'un jeu de mots.", "Je n'aime pas perdre."], l: 0 },
  { s: ['Je parle 12 langues.', "J'ai déjà fait une sieste de 3 jours.", 'Je préfère le jour à la nuit.'], l: 2 },
  { s: ['Mes antennes captent la radio.', "J'ai un abonnement à la salle de sport.", 'Je ne mange que des piles.'], l: 1 },
  { s: ["J'ai battu un champion d'échecs.", 'Mon rêve : danser le coupé-décalé.', "J'ai peur du noir."], l: 0 },
  { s: ["J'ai déjà été mis à jour 300 fois.", 'Je déteste les mises à jour.', 'Je collectionne les vis.'], l: 2 },
  { s: ['Je suis plus vieux que Fuzo.', 'Je joue au Mot Mystère tous les matins.', "J'ai un compte TikTok secret."], l: 0 },
  { s: ['Ma batterie dure 100 ans.', "J'adore le bruit de la pluie.", "Je m'appelle Kobi."], l: 0 },
  { s: ['Je sais faire des crêpes.', "J'ai déjà rouillé une fois.", 'Je dis toujours la vérité.'], l: 2 },
];

/* ---------- Petit Bac ---------- */
export const BACCATS = ['Prénom', 'Pays', 'Ville', 'Animal', 'Fruit ou légume', 'Métier', 'Marque', 'Objet de la maison', 'Plat', 'Sport', 'Célébrité', 'Film ou série',
  'Instrument de musique', 'Vêtement', 'Partie du corps', 'Boisson', 'Artiste musical', 'Moyen de transport', 'Truc dans un frigo', 'Excuse pour être en retard',
  'Chose qui fait peur', 'Mot qui fait sourire', 'Chose jaune', 'Chose dans une valise', 'Couleur', 'Insulte gentille', 'Personnage de dessin animé', 'Chose ronde',
  'Cadeau nul', 'Chose qui pique', 'Chose à la plage', 'Activité du week-end'];
export const BACLETTERS = 'ABCDEFGHIJLMNOPRSTV';

/* ---------- Histoire à deux ---------- */
export const HSTARTS = [
  ['La valise oubliée', "Personne n'avait réclamé la valise rouge qui tournait seule sur le tapis de l'aéroport."],
  ['Le message de minuit', "À minuit pile, un message arriva d'un numéro inconnu : « Ne sors surtout pas demain. »"],
  ['La recette secrète', "Grand-mère avait caché sa recette secrète quelque part dans la maison avant de partir en voyage."],
  ['Le chat de l\'ambassadeur', "Le chat de l'ambassadeur avait disparu, et toute l'ambassade était sens dessus dessous."],
  ['Panne à Ottawa', "Ce soir-là, en plein hiver, toutes les lumières d'Ottawa s'éteignirent en même temps."],
  ['Le zémidjan magique', "Le conducteur de zémidjan sourit et dit : « Je peux t'emmener n'importe où. Vraiment n'importe où. »"],
  ['Le dernier métro', "Le dernier métro de Lyon s'arrêta dans une station qui n'existait sur aucun plan."],
  ['La carte au trésor', "En rangeant le grenier, ils trouvèrent une carte dessinée à la main, avec une croix au milieu de Cotonou."],
  ['Le robot amoureux… de la musique', "Le robot de la cuisine se mit soudain à danser dès qu'on mettait de la musique."],
  ['Le concours de cuisine', "Il ne restait que dix minutes avant la fin du concours, et le plat principal venait de tomber par terre."],
  ['Le voisin mystérieux', "Le nouveau voisin ne sortait que la nuit et laissait toujours une odeur de cannelle dans le couloir."],
  ['L\'appel vidéo', "Pendant l'appel vidéo, quelqu'un passa derrière elle. Mais elle vivait seule."],
  ['Le perroquet bavard', "Le perroquet répétait sans arrêt une phrase que personne dans la famille n'avait jamais prononcée."],
  ['La porte du grenier', "Depuis vingt ans, la porte du grenier était fermée à clé. Ce matin, elle était grande ouverte."],
  ['Le billet gagnant', "Le ticket de loterie gagnant s'envola par la fenêtre au moment même où ils le vérifiaient."],
  ['Le mariage du siècle', "À une heure du mariage, le marié reçut un appel : la salle de réception avait disparu."],
  ['La forêt qui parle', "Au milieu de la forêt, un vieil arbre se racla la gorge et dit bonjour."],
  ['Mission sur Mars', "La première boulangerie de Mars ouvrait ses portes, et il n'y avait plus une seule pincée de farine."],
  ['Le match décisif', "Il restait une minute à jouer, le score était de 0-0, et le gardien venait de perdre ses chaussures."],
  ['Le journal intime', "Elle ouvrit le vieux journal intime acheté aux puces et y trouva… son propre prénom."],
  ['La tempête de neige', "Coincés par la tempête dans un petit chalet, ils découvrirent une trappe sous le tapis."],
  ['L\'audition', "Au moment de monter sur scène pour l'audition, il réalisa qu'il avait appris la mauvaise chanson."],
  ['Le colis surprise', "Le colis n'avait pas d'expéditeur. Il bougeait légèrement et faisait un petit bruit de grelot."],
  ['La machine à remonter le temps', "La machine fit un bruit terrible, et ils se retrouvèrent dans le Lyon de 1900."],
];
export const HWORDS = ['banane', 'parapluie', 'grand-mère', 'dragon', 'chaussette', 'avion', 'trompette', 'pirate', 'glace', 'téléphone', 'secret', 'mangue', 'fusée', 'chameau',
  'trésor', 'pyjama', 'moustache', 'clé', 'bougie', 'tempête', 'voleur', 'princesse', 'crocodile', 'gâteau', 'miroir', 'fantôme', 'pizza', 'taxi', 'caméléon', 'boussole',
  'perruque', 'marché', 'tambour', 'ascenseur', 'champion', 'diamant', 'citrouille', 'lunettes', 'escargot', 'robot', 'castor', 'érable', 'sirop', 'neige', 'baobab',
  'pagne', 'griot', 'piment', 'éléphant', 'koala', 'bibliothèque', 'pharmacie', 'pompier', 'magicien', 'concert', 'karaoké', 'sieste', 'cerf-volant', 'tortue', 'volcan',
  'astronaute', 'bonbon', 'facture', 'licorne', 'aspirateur', 'poussin', 'cactus', 'ananas', 'hélicoptère', 'chapeau', 'carte', 'voisin', 'hamac', 'tornade', 'serpent',
  'violon', 'requin', 'confiture', 'cinéma', 'casserole', 'baleine', 'manège', 'ninja', 'fromage', 'policier', 'papillon', 'trottinette', 'lasagnes', 'girafe', 'bateau'];
export const HTWISTS = ['Un nouveau personnage arrive.', 'Quelqu\'un ment.', 'Un animal se met à parler.', 'Il se met à pleuvoir (ou à neiger).', 'Tout tourne mal, d\'un coup.',
  'Ajoute une réplique entre guillemets.', 'Quelqu\'un éclate de rire.', 'Un objet disparaît.', 'Un téléphone sonne.', 'On découvre un indice.', 'Quelqu\'un a très faim.',
  'Ajoute un bruit étrange.', 'Un vieux souvenir refait surface.', 'Quelqu\'un s\'endort.', 'Un plan génial se met en place.', 'Une porte claque.', 'Quelqu\'un chante.',
  'Une odeur bizarre arrive.', 'Un personnage révèle un talent caché.', 'Ça se passe soudain ailleurs.'];

/* ---------- Défi photo ---------- */
export const PHOTOS = ['Quelque chose de bleu', 'Ton petit-déjeuner', 'La vue depuis ta fenêtre', 'Ton objet préféré', 'Ton coin préféré de la maison', 'Une ombre rigolote',
  'Tes chaussures du jour', 'Quelque chose de rond', 'Ton ciel en ce moment', 'Un truc qui te fait sourire', 'Ta grimace la plus drôle', 'Le contenu de ton sac',
  'Quelque chose de jaune', 'Une plante', 'Ton plat du jour', 'Un reflet', 'Ta boisson du moment', 'Quelque chose de vieux', 'Un détail de ta rue', 'Ton bureau',
  'Une lettre ou un chiffre trouvé dans la rue', 'Un truc doux', 'Ce que tu vois en levant les yeux', 'Un truc rouge', 'Ton plus beau sourire', 'Une texture intéressante',
  'Ta tenue du jour', 'Quelque chose qui brille', 'Ton dernier achat', 'Une forme de cœur trouvée par hasard', 'Un endroit où tu aimerais être avec ton duo', 'Ton livre ou ta série du moment',
  'Quelque chose de petit', 'Quelque chose de géant', 'Ton animal (ou un animal croisé)', 'Le meilleur angle de ta ville', 'Une photo floue… exprès', 'Un truc vert',
  'Ta main avec un objet', 'Ce qui est dans ton frigo', 'Ton reflet dans une vitre', 'Un coucher ou lever de soleil', 'Une fleur', 'Ton dessert', 'Un panneau drôle',
  'Ta playlist du moment (capture)', 'Un objet de ton enfance', 'Quelque chose en double', 'Ton moyen de transport du jour', 'Une lumière la nuit', 'La première chose à ta gauche',
  'Ta pose de super-héros', 'Un nuage avec une forme', 'Un truc qui te rappelle ton duo', 'Ton parfum ou ta crème préférée', 'Quelque chose de rayé', 'Tes pieds dans un lieu sympa',
  'Le meilleur plat de la semaine', 'Une photo en noir et blanc', 'Ton endroit pour réfléchir', 'Quelque chose de carré', 'Une porte jolie', 'Un objet africain', 'Un mot que tu aimes, écrit à la main',
  'Ton look « je viens de me réveiller »', 'Un objet qui raconte une histoire', 'La chose la plus colorée autour de toi', 'Ton snack secret', 'Un escalier', 'Une photo prise d\'en bas',
  'Une photo prise d\'en haut', 'Ta tasse préférée', 'Une selfie avec un fond surprenant', 'Ton outil de travail', 'Une chose qui fait du bruit', 'Un endroit calme', 'Un truc qui sent bon',
  'Quelque chose qui commence par F (comme Fuzo)', 'Ton humeur en une photo', 'Le ciel de ce soir'];
