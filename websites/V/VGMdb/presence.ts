const presence = new Presence({
		clientId: "928142086446923798"
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "logo",
			startTimestamp: browsingTimestamp
		},
		cover = await presence.getSetting<boolean>("cover"),
		shortTitle = document.title.match(/(.*) -/)[1],
		path = document.location.pathname;

	if (path.startsWith("/album")) {
		presenceData.details = document.querySelector<HTMLSpanElement>(
			"#innermain > h1 > span:nth-child(1)"
		).textContent;
		presenceData.state =
			document.querySelector<HTMLDivElement>("#coverart").title;
		if (cover) {
			if (
				document.querySelector<HTMLMetaElement>("head > meta:nth-child(38)")
			) {
				presenceData.largeImageKey = document.querySelector<HTMLMetaElement>(
					"head > meta:nth-child(38)"
				).content;
				presenceData.smallImageKey = "logo";
			} else presenceData.largeImageKey = "logo";
		}
		presenceData.buttons = [{ label: "View Album", url: document.URL }];
	} else if (path.startsWith("/artist")) {
		presenceData.details = "Viewing an artist:";
		presenceData.state = shortTitle;
		if (cover) {
			if (
				document.querySelector<HTMLAnchorElement>(
					"#leftfloat > div:nth-child(3) > a"
				)
			) {
				presenceData.largeImageKey = document.querySelector<HTMLAnchorElement>(
					"#leftfloat > div:nth-child(3) > a"
				).href;
				presenceData.smallImageKey = "logo";
			} else if (
				document.querySelector<HTMLAnchorElement>(
					"#innermain > div:nth-child(2) > a"
				)
			) {
				presenceData.largeImageKey = document.querySelector<HTMLAnchorElement>(
					"#innermain > div:nth-child(2) > a"
				).href;
				presenceData.smallImageKey = "logo";
			} else presenceData.largeImageKey = "logo";
		}
		presenceData.buttons = [{ label: "View Artist", url: document.URL }];
	} else if (path.startsWith("/org") || path.startsWith("/product")) {
		if (path.startsWith("/org")) {
			presenceData.details = "Viewing a label/organization:";
			presenceData.buttons = [{ label: "View Label/Org", url: document.URL }];
		} else if (path.startsWith("/product")) {
			presenceData.details = "Viewing a product:";
			presenceData.buttons = [{ label: "View Product", url: document.URL }];
		}
		presenceData.state = shortTitle;
		if (cover) {
			if (
				document.querySelector<HTMLAnchorElement>(
					"#innermain > div:nth-child(2) > a"
				)
			) {
				presenceData.largeImageKey = document.querySelector<HTMLAnchorElement>(
					"#innermain > div:nth-child(2) > a"
				).href;
				presenceData.smallImageKey = "logo";
			} else presenceData.largeImageKey = "logo";
		}
	} else if (path.startsWith("/event")) {
		presenceData.details = "Viewing an event:";
		presenceData.state = shortTitle;
	} else if (path.startsWith("/db")) {
		presenceData.details = "Searching the database";
		if (path.includes("albums")) presenceData.state = "Browsing albums";
		else if (path.includes("artists")) presenceData.state = "Browsing artists";
		else if (path.includes("org"))
			presenceData.state = "Browsing labels & organizations";
		else if (path.includes("product")) presenceData.state = "Browsing products";
		else if (path.includes("marketplace"))
			presenceData.state = "Browsing the marketplace";
	} else if (path.startsWith("/search")) presenceData.details = "Searching...";
	else if (
		path.startsWith("/forums") &&
		(path.includes("forumdisplay") || path.includes("showthread"))
	) {
		if (path.includes("forumdisplay"))
			presenceData.details = "Viewing a forum:";
		else if (path.includes("showthread"))
			presenceData.details = "Viewing a thread:";
		else presenceData.details = "Browsing the forum";
		presenceData.state = shortTitle;
	}
	presence.setActivity(presenceData);
});
