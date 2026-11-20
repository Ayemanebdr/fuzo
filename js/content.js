import { TELE2, DEV2, CQW2, WORDS2, DECKS2 } from './content-extra.js';
// Contenus des jeux
const TELE_OLD=["Un fruit","Un animal de la ferme","Une couleur","Un pays d'Afrique","Un super-héros","Un truc qu'on trouve dans un frigo","Une marque de voiture","Un sport","Un instrument de musique","Un plat africain","Une ville du Canada","Un métier","Un truc qui pique","Un objet de la salle de bain","Un dessert","Une boisson chaude","Un réseau social","Un pays d'Europe","Un légume vert","Un animal qui vole","Un truc qu'on emporte à la plage","Un chiffre entre 1 et 10","Une saison","Une planète","Un jour de la semaine","Un truc jaune","Un mot en anglais","Un insecte","Une langue","Une fête de l'année","Un animal marin","Un truc qu'on fait le dimanche","Un vêtement d'hiver","Une émotion","Un objet rond","Un jeu de société","Une épice","Un truc qui fait peur","Un moyen de transport","Un fromage","Une matière à l'école","Un monument célèbre","Une partie du corps","Un truc qu'on trouve dans un sac","Un arbre","Une pièce de la maison","Une appli sur le téléphone","Un dessin animé","Une fleur","Un truc froid","Une forme géométrique","Un oiseau","Un truc qui colle","Un snack pour une soirée film","Une ville d'Afrique de l'Ouest","Un animal de la savane","Un truc rouge","Un mot qui rime avec « bateau »","Une marque de téléphone","Un fast-food","Une star de la musique","Un truc qu'on fait quand on s'ennuie","Un cadeau d'anniversaire","Un truc qui fait du bruit","Un super-pouvoir","Un pays d'Asie","Une boisson sans alcool","Un sport d'hiver","Un truc qu'on trouve dans une cuisine","Un animal domestique"];
const DEV1=[
{c:'fun',q:"Le matin, je suis plutôt…",o:["Debout direct","Snooze ×3","Zombie jusqu'au café","Grognon·ne"]},
{c:'fun',q:"Mon super-pouvoir idéal",o:["Téléportation","Invisibilité","Voler","Lire dans les pensées"]},
{c:'fun',q:"Mon repas réconfort",o:["Pizza","Le plat de maman","Fast-food","Dessert direct"]},
{c:'fun',q:"En soirée, je suis celui/celle qui…",o:["Danse sans arrêt","Reste près du buffet","Parle à tout le monde","Veut déjà rentrer"]},
{c:'fun',q:"Je gagne 10 000 €, je…",o:["Voyage","Investis","Fais du shopping","Gâte mes proches"]},
{c:'fun',q:"Mon pire défaut au quotidien",o:["Toujours en retard","Procrastination","Têtu·e","Tête en l'air"]},
{c:'fun',q:"Mon genre de film préféré",o:["Action","Comédie","Horreur","Romance"]},
{c:'fun',q:"Ma façon de répondre aux messages",o:["Instantané","3 heures après","Lu, puis oublié","Vocal de 5 min"]},
{c:'fun',q:"Mon animal totem",o:["Chat","Lion","Paresseux","Dauphin"]},
{c:'fun',q:"Si j'étais un emoji",o:["😂","😎","🥹","🤔"]},
{c:'fun',q:"Ce qui m'énerve le plus",o:["Les gens lents","Le bruit en mangeant","Les retards","Les mensonges"]},
{c:'fun',q:"Mon talent caché",o:["Cuisine","Chant","Imitations","Danse"]},
{c:'fun',q:"Dans un film d'horreur, je suis…",o:["Le/la premier·e à y passer","Le/la survivant·e","Celui/celle qui fuit","Le/la héros"]},
{c:'fun',q:"Le dimanche idéal",o:["Grasse mat'","Sport","Sortie entre amis","Série toute la journée"]},
{c:'tp',q:"Tu préfères…",o:["Ne plus jamais manger de riz","Ne plus jamais manger de pain"]},
{c:'tp',q:"Tu préfères…",o:["Vivre sans musique","Vivre sans films ni séries"]},
{c:'tp',q:"Tu préfères…",o:["Avoir toujours trop chaud","Avoir toujours trop froid"]},
{c:'tp',q:"Tu préfères…",o:["Parler aux animaux","Parler toutes les langues"]},
{c:'tp',q:"Tu préfères…",o:["Voyager dans le passé","Voyager dans le futur"]},
{c:'tp',q:"Tu préfères…",o:["Une plage paradisiaque","Un chalet à la montagne"]},
{c:'tp',q:"Tu préfères…",o:["Être célèbre","Être très riche mais inconnu·e"]},
{c:'tp',q:"Tu préfères…",o:["Plus jamais de réseaux sociaux","Plus jamais de télé"]},
{c:'tp',q:"Tu préfères…",o:["Vivre en France pour toujours","Vivre au Canada pour toujours"]},
{c:'tp',q:"Tu préfères…",o:["Toujours dire la vérité","Pouvoir mentir sans jamais être démasqué·e"]},
{c:'tp',q:"Tu préfères…",o:["Un hiver canadien sans fin","Une canicule sans fin"]},
{c:'tp',q:"Tu préfères…",o:["Dîner avec un personnage historique","Dîner avec ton idole actuelle"]},
{c:'tp',q:"Tu préfères…",o:["Savoir la date de ta mort","Savoir comment tu vas mourir"]},
{c:'tp',q:"Tu préfères…",o:["Un mois sans téléphone","Un mois sans sucre"]},
{c:'deep',q:"Ce qui compte le plus pour moi",o:["La famille","La liberté","La réussite","La paix intérieure"]},
{c:'deep',q:"Quand je suis triste, j'ai besoin de…",o:["Parler","Être seul·e","Me changer les idées","Un câlin"]},
{c:'deep',q:"Mon plus grand moteur",o:["Prouver ma valeur","Rendre mes proches fiers","Ma curiosité","La sécurité"]},
{c:'deep',q:"Dans 10 ans, je me vois…",o:["En Afrique","En Europe","En Amérique du Nord","Un peu partout"]},
{c:'deep',q:"Ma façon de montrer que je tiens à quelqu'un",o:["Les mots","Les cadeaux","Le temps passé ensemble","Les petits gestes"]},
{c:'deep',q:"Face à un conflit, je…",o:["En parle tout de suite","Attends que ça passe","Écris un message","Fais une blague"]},
{c:'deep',q:"Ce qui me fait le plus peur",o:["L'échec","La solitude","Les regrets","L'ennui"]},
{c:'deep',q:"Pour recharger mes batteries",o:["Dormir","Sortir","Musique","Prier / méditer"]},
{c:'deep',q:"Ma plus grande qualité",o:["Loyauté","Générosité","Ambition","Humour"]},
{c:'abs',q:"Si je devais combattre…",o:["Un canard géant","100 mini-chevaux","Un pigeon très énervé","Ma propre ombre"]},
{c:'abs',q:"Mon nom de catcheur",o:["Le Tonnerre","La Machine","Le Yaourt Mortel","Mamba Doux"]},
{c:'abs',q:"Je survis combien de temps dans la jungle ?",o:["1 heure","1 jour","1 semaine","Je deviens roi/reine"]},
{c:'abs',q:"Si mon frigo parlait, il dirait…",o:["Encore toi ?!","Ferme-moi !","Y'a rien ici","Merci de me nourrir"]},
{c:'abs',q:"Le légume qui me ressemble",o:["Piment","Patate","Concombre","Carotte"]},
{c:'abs',q:"Apocalypse zombie : mon arme",o:["Une poêle","Un balai","Mes tongs","Ma voix"]},
{c:'abs',q:"Si j'étais un meuble",o:["Canapé","Lit","Frigo","Lampe"]},
{c:'abs',q:"Mon cri de guerre",o:["« Wesh ! »","« Allez hop ! »","« Mais NON ! »","« Yaaaah ! »"]},
{c:'nous',q:"Le meilleur rendez-vous à distance",o:["Film en même temps","Cuisine en visio","Jeux en ligne","Une vraie lettre"]},
{c:'nous',q:"Ce qui me manque le plus",o:["Ta voix en vrai","Tes câlins","Rire ensemble","Manger ensemble"]},
{c:'nous',q:"Notre prochain voyage idéal",o:["Plage","Grande ville","Safari","Road trip"]},
{c:'nous',q:"Le jour où on se retrouve, on…",o:["Reste à la maison","Va au resto","Se balade","Fait la fête"]},
{c:'nous',q:"Notre style de couple",o:["Duo comique","Duo aventurier","Duo cocooning","Duo ambitieux"]},
{c:'nous',q:"Le plat qu'on devrait cuisiner ensemble",o:["Riz au gras","Pizza maison","Poutine","Crêpes"]}
];
export const DEVCATS={mix:{n:'Mélange',e:'shuffle',c:'#f3b94d',d:'Un peu de tout'},fun:{n:'Fun',e:'smiley_wink',c:'#ef8fb3',d:'Habitudes & petits travers'},tp:{n:'Tu préfères',e:'swords',c:'#62a8e5',d:'Dilemmes à deux choix'},deep:{n:'Profond',e:'moon',c:'#3bb5a0',d:'Valeurs & émotions'},abs:{n:'Absurde',e:'smiley_x',c:'#9ccf6a',d:'Totalement inutile'},nous:{n:'Toi & moi',e:'heart',c:'#f0745f',d:'La distance, nous'}};
const CQW1=["chat","maison","avion","banane","soleil","pizza","guitare","girafe","parapluie","montagne","vélo","téléphone","lunettes","fusée","arbre","poisson","gâteau","voiture","bateau","étoile","clé","pomme","chaussure","igloo","castor","feuille d'érable","baobab","pirogue","ananas","éléphant","lion","crocodile","serpent","araignée","escargot","champignon","glace","hamburger","frites","bougie","lampe","horloge","ordinateur","livre","crayon","ciseaux","fantôme","robot","dragon","sirène","pirate","couronne","château","pont","tente","cactus","palmier","nuage","arc-en-ciel","éclair","bonhomme de neige","ski","ballon","piscine","volcan","tortue","pingouin","hibou","abeille","papillon","dent","oeil","main","chapeau","cravate","valise","cadeau","train","hélicoptère","sous-marin","ampoule","échelle","toboggan","brosse à dents","lit","canapé","micro","casque audio","appareil photo","tour Eiffel","pyramide","orignal","hockey","mangue","tambour","moustique","chaise","fourchette","parachute","sapin","œuf","lune","tasse"];
const WORDS1="ARBRE AVION BALLE BATON BLANC BRUIT CADRE CALME CANOT CARTE CHAMP CHANT CHAUD CHOSE CLOWN COEUR CORPS COUPE CRANE CREME DANSE DOIGT DROLE ECOLE ETAGE FAUVE FERME FILLE FORET FOULE FRERE FROID FRUIT GALET GARDE GLACE GRAIN GRAND GUIDE HERBE HOMME HOTEL IMAGE JAUNE JOUET LAPIN LARGE LIGNE LUNDI MAGIE MARIN MERCI METRE NUAGE OCEAN OMBRE ONCLE ORAGE OUTIL PATTE PERLE PHARE PIANO PIZZA PLUIE POCHE POIRE POINT POULE PRISE RADIO REINE ROUGE ROUTE SABLE SAUCE SINGE SONGE SPORT STYLO TAPIS TARTE TEMPS TIGRE TITRE TOAST TRAIN TUILE USINE VAGUE VALSE VENTE VIDEO VILLE VOILE ZEBRE BOIRE PAPAYE".split(' ').filter(w=>w.length===5);
const DECKS1={
fun:{n:'Fun',e:'confetti',c:'#f3b94d',cards:["Quel est le truc le plus bizarre que tu aies mangé ?","Si ta vie était une série, quel serait son titre ?","Quelle chanson te fait danser même quand tu es fatigué·e ?","Ton plus gros fou rire, c'était quand ?","Quel objet inutile refuses-tu de jeter ?","Si tu pouvais maîtriser un talent en une nuit, lequel ?","Quelle appli ouvres-tu en premier le matin ?","Le pire cadeau que tu aies reçu ?","Ton plat signature en cuisine ?","Si tu étais un personnage de dessin animé, lequel ?","Ta plus grosse honte en public ?","24 h de liberté totale et budget illimité : programme ?","Quel mot dis-tu beaucoup trop ?","Ta pire coupe de cheveux ?","Quel snack pourrais-tu manger tous les jours ?"]},
deep:{n:'Profond',e:'moon',c:'#3bb5a0',cards:["De quoi es-tu le plus fier·e cette année ?","Quelle personne a le plus changé ta façon de voir la vie ?","Quel conseil donnerais-tu à toi il y a 10 ans ?","C'est quoi, pour toi, une vie réussie ?","Qu'as-tu appris de ta plus grande erreur ?","Quand t'es-tu senti·e le plus libre ?","Qu'est-ce qui te fait te sentir chez toi ?","Quelle peur aimerais-tu dépasser ?","Qu'aimerais-tu qu'on retienne de toi ?","Quelle habitude a changé ta vie ?","Qu'est-ce qui te manque le plus de ton enfance ?","Pour quoi es-tu reconnaissant·e aujourd'hui ?"]},
imag:{n:'Imagine…',e:'planet',c:'#8d7bea',cards:["Tu te réveilles dans le corps d'un animal pour une journée : lequel, et que fais-tu ?","Tu ouvres un restaurant : nom, concept et plat phare ?","Tu peux supprimer une chose du monde : laquelle ?","Tu reçois une lettre de toi dans 20 ans : que dit-elle ?","Tu peux vivre dans n'importe quel film : lequel ?","On t'offre une île : comment l'organises-tu ?","Président·e pour une journée : ta première loi ?","Tu inventes une fête nationale : on célèbre quoi ?","5 minutes avec toi enfant : tu lui dis quoi ?","Une machine à remonter le temps, un seul voyage : où et quand ?","Ton autobiographie : quel titre ?","Tu lances une marque : ce serait quoi ?"]},
souv:{n:'Souvenirs',e:'camera',c:'#ef8fb3',cards:["Ton meilleur souvenir d'enfance ?","Le premier concert ou spectacle que tu as vu ?","Ton prof préféré, et pourquoi ?","Le plus beau voyage de ta vie ?","Un moment où tu as eu très peur ?","Ton jouet préféré quand tu étais petit·e ?","La meilleure fête de ta vie ?","Le plat de ton enfance qui te manque ?","Une bêtise que tes parents n'ont jamais sue ?","Ton premier job, c'était comment ?","Une rencontre qui a tout changé ?","Le jour où tu as le plus ri ?"]},
nous:{n:'Toi & moi',e:'heart',c:'#f0745f',cards:["Ton souvenir préféré de nous deux ?","Qu'est-ce qu'on devrait faire ensemble au moins une fois dans la vie ?","Quelle chanson te fait penser à moi ?","Qu'as-tu remarqué en premier chez moi ?","Le prochain truc qu'on fera quand on se verra ?","Quelle tradition aimerais-tu qu'on crée tous les deux ?","Qu'est-ce qui te fait rire chez moi ?","Une ville qu'on doit visiter ensemble ?","Quel film regarde-t-on en même temps cette semaine ?","Si on avait un nom de duo, ce serait quoi ?","Qu'est-ce qui rend la distance plus facile pour toi ?","Un petit défi pour cette semaine, chacun de son côté ?"]},
deb:{n:'Débats',e:'fire',c:'#62a8e5',cards:["L'ananas sur la pizza : génie ou crime ?","Mieux vaut être en avance ou pile à l'heure ?","Les séries sont meilleures que les films. D'accord ?","Petit-déj salé ou sucré ?","Les vocaux de plus de 2 minutes devraient être interdits ?","L'argent fait-il le bonheur ?","Peut-on rester ami·e avec son ex ?","Le meilleur repas de la journée, c'est le dîner ?","Vivre en ville ou à la campagne ?","Le riz au gras bat tous les plats du monde ?","L'hiver, meilleure saison ?","Les réseaux sociaux nous rendent plus seuls ?"]}
};

const uniq = a => [...new Set(a)];
const BAD = new Set(['CINQS','CITRE','CIGNE','GROSE','TOXIC','TUNER','NOVAS','PAPAS','MODEL','RIRES','CAFES','BEBES','CHARS','KIWIS','MIELS','NEUFS','TROPHE','DONNE','FIERE','JOIES','LONGS','PURES','TRUCS','CLOUS','CUBES','FACES','FLOTS','GOUTS','PLATS','TETES','PONTS','PECHE','ABOIS','ABRIS','AINSI','ALORS','APRES','PARMI','VOIRE','VOTRE','ELLES','DEVIN','DORER','ENTRE','GRILL','RELAX','TULLE','ARGOT','SACRE','SOURD','PRIVE','NATAL','VENDU','COUSU','BATTU','LEGER','RAVIE','VEINE','GALOP','MANIE','NOUER','ONDES','PAYER','RATER','RASER','VISER','TIRER','JUGER','LAVER','LOGER','LEVER','CODER','CIRER','CUIRE','NAGER','PRIER','REVER','VENIR','VIVRE','VOLER','AIMER','ALLER','AVOIR','BOIRE','FAIRE','JOUER','ATOUT','BREVE','LATTE','LUEUR','SEUIL','TAMIS']);
export const TELE = TELE2;
export const DEV = DEV1.concat(DEV2);
export const CQW = uniq(CQW1.concat(CQW2));
export const WORDS = uniq(WORDS1.concat(WORDS2)).filter(w => /^[A-Z]{5}$/.test(w) && !BAD.has(w));
export const DECKS = Object.fromEntries(Object.entries(DECKS1).map(([k, v]) => [k, Object.assign({}, v, { cards: uniq(v.cards.concat(DECKS2[k] || [])) })]));
