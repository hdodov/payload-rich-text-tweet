export default function withTweet(editor) {
	const { isVoid } = editor;

	editor.isVoid = (element) =>
		element.type === "tweet" ? true : isVoid(element);

	return editor;
}
