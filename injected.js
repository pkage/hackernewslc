const inject = () => {

	const createPost = (title, subtext) => ({title, subtext})

	const rows = document.querySelectorAll('tr:not(.spacer)')
	const posts = []

	// scan for posts and save the title & subtext rows
	for (let i = 0; i < rows.length - 1; i++) {
		if (rows[i].classList.contains('athing')) {
			posts.push(createPost(rows[i], rows[i + 1]))
		}
	}

	// create the link + comments button
	const addLCButton = (post) => {
		let link, comments
		try {
			link = post.title.querySelector('.storylink').getAttribute('href')
			// get the last subtext link
			comments = post.subtext.querySelectorAll('a')[3].getAttribute('href')
		} catch (e) {
			//console.warn('failed to inject onto ', post, e)
			return
		}

		const openLC = e => {
			e.preventDefault()

			if (comments != link) {
				window.open(comments)
			}
			window.open(link)
		}

		const lcButton = document.createElement('a')
		lcButton.innerText = 'l+c'
		lcButton.setAttribute('href', '#')

		// explicit binding? what happened to closures?
		lcButton.addEventListener('click', openLC)

		// inject
		const subtextTarget = post.subtext.querySelector('.subtext')
		subtextTarget.appendChild(document.createTextNode(' | '))
		subtextTarget.appendChild(lcButton)
	}
	
	// map the function onto each post
	posts.map(addLCButton)
}

inject()
