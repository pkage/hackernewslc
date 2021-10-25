const addLCs = () => {

	const createPost = (title, subtext) => ({title, subtext})

	const rows = document.querySelectorAll('tr:not(.spacer)')
	const posts = []

	// scan for posts and save the title & subtext rows
	for (let i = 0; i < rows.length - 1; i++) {
		if (rows[i].classList.contains('athing')) {
			posts.push(createPost(rows[i], rows[i + 1]))
		}
	}

    const getCommentsLink = subtext => {
        for (let link of subtext) {
            if (/(comment|discuss)/.test(link.textContent)) {
                return link
            }
        }
        return null
    }

	// create the link + comments button
	const addLCButton = (post) => {
		let link, comments
		try {
			// get the last subtext link
            comments = getCommentsLink(post.subtext.querySelectorAll('a')).href
            
		} catch (e) {
			console.warn('failed to inject onto ', post, e)
			return
		}

		const lcButton = document.createElement('a')
		lcButton.innerText = 'l+c'
		lcButton.setAttribute('target', '_blank')

        link = post.title.querySelector('.titlelink').href

        // avoid opening self links twice
        if (new URL(link).hostname !== 'news.ycombinator.com') {
            lcButton.setAttribute('href', comments + '#openlc') 
        } else {
            lcButton.setAttribute('href', comments)
        }

        const opener = e => {
            // enforces opening in background
            e.preventDefault()
            window.open(lcButton.href)
            window.focus()
        }

        lcButton.addEventListener('click', opener)

		// inject
		const subtextTarget = post.subtext.querySelector('.subtext')
		subtextTarget.appendChild(document.createTextNode(' | '))
		subtextTarget.appendChild(lcButton)

	}
	
	// map the function onto each post
	posts.map(addLCButton)
}

const inject = () => {
    const url = new URL(window.location.href)
    if (url.hash === '#openlc') {
        // this is gross, but basically open the window, focus the parent back,
        // and then modify the page url so it doesn't trigger twice
        window.open(document.querySelector('a.titlelink').href)
        window.opener.focus()
        url.hash = ''
        window.history.replaceState(null, '', url.href)
    } else if (url.pathname !== '/item') {
        addLCs()
    }
}

inject()
