// src/admin/components/forms/field-types/RichText/elements/upload/Element/index.tsx

import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Transforms } from "slate";
import { ReactEditor, useSlate, useFocused, useSelected } from "slate-react";
import { useModal } from "@faceless-ui/modal";
import Button from "payload/dist/admin/components/elements/Button";
import { useDrawerSlug } from "payload/dist/admin/components/elements/Drawer/useDrawerSlug";
import { Fields } from "payload/dist/admin/components/forms/Form/types";
import reduceFieldsToValues from "payload/dist/admin/components/forms/Form/reduceFieldsToValues";
import buildStateFromSchema from "payload/dist/admin/components/forms/Form/buildStateFromSchema";
import { useAuth } from "payload/dist/admin/components/utilities/Auth";
import { useLocale } from "payload/dist/admin/components/utilities/Locale";
import { useTheme } from "payload/dist/admin/components/utilities/Theme";
import { TweetDrawer } from "../TweetDrawer";
import { getBaseFields } from "../TweetDrawer/baseFields";

import "./index.scss";

const baseClass = "rich-text-tweet";

export default function Element(props) {
	const { attributes, children, element, fieldProps } = props;

	const editor = useSlate();
	const locale = useLocale();
	const { user } = useAuth();
	const { theme } = useTheme();
	const { t } = useTranslation("fields");
	const { openModal, toggleModal, closeModal } = useModal();
	const [renderModal, setRenderModal] = useState(false);
	const [initialState, setInitialState] = useState<Fields>({});

	const drawerSlug = useDrawerSlug("rich-text-link");
	const selected = useSelected();
	const focused = useFocused();
	const fieldSchema = getBaseFields();

	const urlMatch = element.url.match(/twitter.com\/(.+)\/status\/(.+)/);
	const urlUser = urlMatch[1];
	const urlTweetId = urlMatch[2];

	const updateTweet = useCallback(
		(fields) => {
			const data = reduceFieldsToValues(fields, true);
			const elementPath = ReactEditor.findPath(editor as ReactEditor, element);

			const updatedNode = {
				type: "tweet",
				url: data.url,
				children: [{ text: " " }],
			};

			Transforms.setNodes(editor, updatedNode, { at: elementPath });
		},
		[editor, element]
	);

	const removeTweet = useCallback(() => {
		const elementPath = ReactEditor.findPath(editor as ReactEditor, element);
		Transforms.removeNodes(editor, { at: elementPath });
	}, [editor, element]);

	return (
		<div
			className={[baseClass, selected && focused && `${baseClass}--selected`]
				.filter(Boolean)
				.join(" ")}
			contentEditable={false}
			{...attributes}
		>
			{renderModal && (
				<TweetDrawer
					title="Edit Tweet"
					drawerSlug={drawerSlug}
					fieldSchema={fieldSchema}
					handleClose={() => {
						toggleModal(drawerSlug);
						setRenderModal(false);
					}}
					handleModalSubmit={(fields) => {
						updateTweet(fields);
						closeModal(drawerSlug);
					}}
					initialState={initialState}
				/>
			)}

			<div className={`${baseClass}__card`}>
				<div className={`${baseClass}__topRow`}>
					<div className={`${baseClass}__topRowRightPanel`}>
						<div className={`${baseClass}__collectionLabel`}>
							Tweet {urlUser && `by @${urlUser}`}
						</div>

						<div className={`${baseClass}__actions`}>
							<Button
								className={`${baseClass}__link-edit`}
								icon="edit"
								round
								buttonStyle="icon-label"
								onClick={async (e) => {
									e.preventDefault();
									openModal(drawerSlug);

									const state = await buildStateFromSchema({
										fieldSchema,
										data: {
											url: element.url,
										},
										user,
										operation: "update",
										locale,
										t,
									});

									setInitialState(state);
									setRenderModal(true);
								}}
								tooltip="Edit Tweet"
							/>
							<Button
								icon="x"
								round
								buttonStyle="icon-label"
								className={`${baseClass}__removeButton`}
								onClick={(e) => {
									e.preventDefault();
									removeTweet();
								}}
								tooltip="Remove Tweet"
								disabled={fieldProps?.admin?.readOnly}
							/>
						</div>
					</div>
				</div>
				<div className={`${baseClass}__bottomRow`}>
					<TwitterTweetEmbed
						key={`${urlTweetId}-${theme}`}
						tweetId={urlTweetId}
						options={{ theme }}
					/>
				</div>
			</div>

			{children}
		</div>
	);
}
