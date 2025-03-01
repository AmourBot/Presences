const presence = new Presence({
		clientId: "827620297896230912"
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async function () {
	const presenceData: PresenceData = {
			largeImageKey: "logo"
		},
		setTimeElapsed = await presence.getSetting<boolean>("timeElapsed"),
		setShowButtons = await presence.getSetting<boolean>("showButtons"),
		setSmallImages = await presence.getSetting<boolean>("showSmallImages"),
		urlpath = window.location.pathname.split("/"),
		urlpNum = /nl|fr|de/.test(urlpath[1]) ? 1 : 0;

	if (setTimeElapsed) presenceData.startTimestamp = browsingTimestamp;

	if (!urlpath[urlpNum + 1]) presenceData.details = "Home";
	else if (urlpath[urlpNum + 1] === "c") {
		let num =
			urlpath[2] === "men" || urlpath[2] === "women" || urlpath[2] === "kids"
				? 3
				: 2;
		if (
			document.location.hostname === "www.snipes.be" ||
			document.location.hostname === "www.snipes.ch"
		)
			num = num + urlpNum;
		if (
			document.querySelector("a.b-refinements-category-link.active") &&
			urlpath[num + 1]
		) {
			presenceData.state = document
				.querySelector("a.b-refinements-category-link.active")
				.getAttribute("data-name");
		}
		if (setShowButtons) {
			presenceData.buttons = [
				{
					label: "View Category",
					url: window.location.href //e.g. https://www.snipes.com/c/clothing/trackpants
				}
			];
		}

		if (urlpath[num] === "new") presenceData.details = "New";
		else if (urlpath[num] === "shoes") presenceData.details = "Shoes";
		else if (urlpath[num] === "clothing") presenceData.details = "Clothing";
		else if (urlpath[num] === "accessories")
			presenceData.details = "Accessoires";
		else if (urlpath[urlpNum + 2] === "brands") {
			presenceData.details = "Brands";
			if (urlpath[urlpNum + 3]) {
				presenceData.state = document.querySelector(
					"li.b-breadcrumb-item>span.b-breadcrumb-text"
				).textContent;
			}
		} else if (urlpath[urlpNum + 2] === "sale") presenceData.details = "Sale";
		else if (urlpath[urlpNum + 2] === "deals") presenceData.details = "Deals";
		else if (urlpath[urlpNum + 2] === "musthaves")
			presenceData.details = "Must haves";
		else if (
			document.querySelector("li.b-breadcrumb-item>span.b-breadcrumb-text")
		) {
			presenceData.details = "Category:";
			presenceData.state = document.querySelector(
				"li.b-breadcrumb-item>span.b-breadcrumb-text"
			).textContent;
		}
	} else if (urlpath[urlpNum + 1] === "p") {
		const brand = document.querySelector("div.js-target>a").textContent;
		if (setShowButtons) {
			presenceData.buttons = [
				{
					label: "View Product",
					url: window.location.href
				}
			];
		}

		presenceData.details = brand;
		presenceData.state = document
			.querySelector("div.js-target")
			.textContent.replace(
				document.querySelector("div.js-target>.h-hide").textContent,
				""
			)
			.replace(brand, "")
			.replace(/\s+/g, " ")
			.trim();
	} else if (urlpath[urlpNum + 1].startsWith("search")) {
		presenceData.details = "Search:";
		presenceData.state = new URLSearchParams(window.location.search).get("q");

		if (setShowButtons) {
			presenceData.buttons = [
				{
					label: "View Results",
					url: window.location.href
				}
			];
		}
	} else if (urlpath[urlpNum + 1] === "view-account")
		presenceData.details = "Account";
	else if (urlpath[urlpNum + 1] === "edit-account")
		presenceData.details = "Editing account";
	else if (urlpath[urlpNum + 1] === "cliqueoverview")
		presenceData.details = "Clique";
	else if (urlpath[urlpNum + 1] === "edit-password")
		presenceData.details = "Editing password";
	else if (urlpath[urlpNum + 1] === "order-history")
		presenceData.details = "Order history";
	else if (urlpath[urlpNum + 1] === "wishlist")
		presenceData.details = "Wishlist";
	else if (urlpath[urlpNum + 1] === "cart")
		presenceData.details = "Shopping cart";
	else if (urlpath[urlpNum + 1] === "addresses")
		presenceData.details = "Addresses";
	else if (urlpath[urlpNum + 1] === "newsletter-settings")
		presenceData.details = "Newsletter";
	else if (urlpath[urlpNum + 1] === "newsletter-preferences")
		presenceData.details = "Newsletter settings";
	else if (urlpath[urlpNum + 1] === "login") presenceData.details = "Login";
	else if (urlpath[urlpNum + 1] === "registration")
		presenceData.details = "Register";
	else if (urlpath[urlpNum + 1] === "storefinder")
		presenceData.details = "Storefinder";
	else if (urlpath[urlpNum + 1] === "content") presenceData.details = "Other";

	let smallimage = document.location.hostname
		.replace("www.snipes.", "")
		.replace("www.snipesusa.", "");

	if (setSmallImages) {
		if (smallimage === "com") {
			smallimage =
				document.location.hostname === "www.snipesusa.com" ? "usa" : "de";
		}

		presenceData.smallImageKey = smallimage;
		presenceData.smallImageText = `SNIPES ${smallimage.toUpperCase()}`;
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
