import Button from "./Button";
import Element from "./Element";
import withTweet from "./plugin";

export const TweetElement = {
	name: "tweet",
	Button,
	Element,
	plugins: [withTweet],
};
