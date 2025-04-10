/* <meta property="og:type" content="website">
<meta property="og:url" content="https://stackoverflow.com/questions/6535405/what-is-the-attribute-property-ogtitle-inside-meta-tag">
<meta property="og:site_name" content="Stack Overflow">
<meta property="og:image" itemprop="image primaryImageOfPage" content="https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png?v=73d79a89bded">
<meta name="twitter:card" content="summary">
<meta name="twitter:domain" content="stackoverflow.com">
<meta name="twitter:title" property="og:title" itemprop="name" content="What is the attribute property=&quot;og:title&quot; inside meta tag?">
<meta name="twitter:description" property="og:description" itemprop="description" content="I have this extract of website source code:
&amp;lt;meta content=&quot;This is a basic text&quot; property=&quot;og:title&quot; /&amp;gt;
What does this property attribute stand for, and what is its purpose?"> */

// TODO: Create a Meta util function that have all the field by default and takes in fields to be changes as parameters
type PageMetaData = {
	title?: string;
	description?: string;
	summary?: string;
	imgURL?: string;
};
export const genPageMetaData = ({
	title = "Manipur Institute of Technology",
	description = "Website for MIT College",
	summary = "Website for MIT College",
	imgURL = "https://mitimphal.manipuruniv.ac.in/Manipur_University_Logo.png",
}: PageMetaData) => {
	// const loc = useLocation();
	const baseURL = "https://mitimphal.manipuruniv.ac.in";
	// <link rel="icon" href="/aj.png">
	const defaultMetaData = [
		{
			title,
		},
		{ name: "description", content: description },
		// Open Graph
		{ name: "og:type", content: "website" },
		{ property: "og:url", content: window.location.href },
		{ property: "og:site_name", content: description },
		{
			property: "og:image",
			itemProp: "image primaryImageOfPage",
			content: imgURL,
		},
		// Twitter
		{ name: "twitter:card", content: summary },
		{ name: "twitter:domain", content: baseURL },
		{
			name: "twitter:title",
			property: "og:title",
			itemProp: "name",
			content: description,
		},
		{
			name: "twitter:description",
			property: "og:description",
			itemProp: "description",
			content: description,
		},
	];
	return defaultMetaData;
};
