const authors = [
	'Kie Shields',
	'Nida Williamson',
	'Abbi Reeves',
	'Zara Ritter',
	'Zayan Kramer',
	'Aaminah Rees',
	'Ally Bernal',
	'Mehak Burgess',
	'Pamela Thatcher',
	'Kajetan Sanderson',
	'Francis Waters',
	'Tomos Mohamed',
	'Bertie Chan',
	'Belle Davies',
	'Eamonn Hall',
	'Morris Brook',
	'Keri Stout',
	'Joao Newton',
	'Isabelle Prentice',
	'Marwa Cottrell',
	'Cassie Mansell',
	'Aida White',
	'Cristina Gay',
	'Sanaa Farrell',
	'Anees Ball',
	'Diya Legge',
	'Arianna Prince',
	'Daanish Castro',
	'Kia Oconnor',
	'Ehsan Jordan',
	'Kiaan Zuniga',
	'Umer Barker',
	'Ellesha Guerra',
	'Scarlette Coombes',
	'Igor West',
	'Lyndon Connolly',
	'Aqeel Cottrell',
	'Devin Read',
	'Seth Barnes',
	'Imani Oneil',
	'Krystal Joyce',
	'Jaxson Devine',
	'Tori Parker',
	'Merryn Senior',
	'Robert Humphreys',
	'Anderson Dillard',
	'Troy Christensen',
	'Azra Kaye',
	'Leena Wood',
	'Reef Hilton',
]

const studies = [
	'Antibacterial Screening from Calamansi against Haemophilus Influenza',
	'The Creation of Meat Tender from Makopa (Syzygium samarangense) Extract',
	'Karael Extract as Metal Sensor',
	'The Ability of Butones-butonesan (Gomphrena globosa) as Oil Spill Eliminator',
	'Glucose Creation from Lanzones',
	'Efficacy of Butones-butonesan Extract as Phytoremediating Agent',
	'Antibacterial Screening from Calamansi (Citrus miocrocarpa) Fibers against Haemophilus Influenza',
	'The Utilization of Atis Fibers Extract as Heavy Metal Indicator',
	'Glucose Creation from Tieza (Pouteria Campechiana) Seeds',
	'The Efficacy of Broken Rice Stems Extract as Alternative Latex Substitute',
	'Antibacterial Screening from Malunggay Extract against Staphylococcus aureus',
	'Cellulose Creation from Soro-soro (Euphorbia nerrifolia) Extract',
	'Analyzing IPv6 with VOTE',
	'Deconstructing Agents Using Lakh',
	'The Relationship Between Scheme and Moores Law',
	'Decoupling Multi-Processors from Neural Networks in Checksums',
]

const actions = [
	'commented on',
	'commented on',
	'commented on',
	'commented on',
	'reviewed',
	'uploaded data to',
	'uploaded data to',
	'added analysis to',
	'edited source code for',
	'edited source code for',
	'updated dataset for',
	'updated dataset for',
	'opened a discussion on',
	'opened a discussion on',
]

export function getRandomTimeline() {
	let events = []
	for(let i=0; i < 8; i++){
		let event = getRandomEvent()
		let time = new Date()
		time = new Date(time.setSeconds(time.getSeconds() - i*45))
		event.time = time
		events.push(event)
	}
	return events
}

const randomTimeline = getRandomTimeline()
export default randomTimeline

export function getRandomEvent(){
	return {
		author: getRandomAuthor(),
		action: getRandomAction(),
		study: getRandomStudy(),
		time: new Date(),
	}
}

export function getRandomAuthor(){
	return authors[Math.floor(Math.random() * authors.length)]
}

export function getRandomStudy(){
	return studies[Math.floor(Math.random() * studies.length)]
}

export function getRandomAction(){
	return actions[Math.floor(Math.random() * actions.length)]
}

