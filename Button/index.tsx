// src/admin/components/forms/field-types/RichText/elements/upload/Button/index.tsx

import React, { Fragment } from "react";
import { ReactEditor, useSlate } from "slate-react";
import { useModal } from "@faceless-ui/modal";
import { useDrawerSlug } from "payload/dist/admin/components/elements/Drawer/useDrawerSlug";
import reduceFieldsToValues from "payload/dist/admin/components/forms/Form/reduceFieldsToValues";
import ElementButton from "payload/dist/admin/components/forms/field-types/RichText/elements/Button";
import { injectVoidElement } from "payload/dist/admin/components/forms/field-types/RichText/elements/injectVoid";
import { TweetDrawer } from "../TweetDrawer";
import { getBaseFields } from "../TweetDrawer/baseFields";

const baseClass = "upload-rich-text-button";

const insertTweet = (editor, fields) => {
	const data = reduceFieldsToValues(fields, true);

	const element = {
		type: "tweet",
		url: data.url,
		children: [{ text: " " }],
	};

	injectVoidElement(editor, element);
	ReactEditor.focus(editor);
};

export default function UploadButton() {
	const editor = useSlate();
	const { openModal, closeModal } = useModal();
	const drawerSlug = useDrawerSlug("rich-text-link");
	const fieldSchema = getBaseFields();

	return (
		<Fragment>
			<ElementButton
				className={baseClass}
				format="tweet"
				tooltip={"Add Tweet"}
				el="div"
				onClick={() => {
					openModal(drawerSlug);
				}}
			>
				<svg width="24" height="24" viewBox="0 0 24 24">
					<path
						d="M19.1572 7.73421C19.1682 7.89695 19.1682 8.05969 19.1682 8.22393C19.1682 13.2284 15.4534 19 8.6607 19V18.997C6.65411 19 4.68921 18.4105 3 17.2991C3.29177 17.3351 3.58501 17.3531 3.87898 17.3539C5.54186 17.3554 7.15722 16.7831 8.46545 15.7295C6.88519 15.6987 5.49945 14.642 5.01536 13.0994C5.56892 13.2089 6.13931 13.1864 6.68263 13.0341C4.95978 12.6771 3.72029 11.1247 3.72029 9.32186V9.27386C4.23364 9.5671 4.80841 9.72984 5.39634 9.74783C3.77367 8.63565 3.27349 6.42179 4.25338 4.6909C6.12834 7.057 8.8947 8.49541 11.8644 8.64765C11.5667 7.33224 11.9733 5.95382 12.9327 5.02913C14.4201 3.59522 16.7594 3.66872 18.1576 5.19337C18.9846 5.02613 19.7773 4.7149 20.5027 4.27393C20.2271 5.15062 19.6501 5.89533 18.8793 6.36855C19.6113 6.28005 20.3265 6.07907 21 5.77234C20.5042 6.53429 19.8797 7.198 19.1572 7.73421Z"
						fill="currentColor"
					/>
				</svg>
			</ElementButton>
			<TweetDrawer
				title="Add Tweet"
				drawerSlug={drawerSlug}
				handleModalSubmit={(fields) => {
					insertTweet(editor, fields);
					closeModal(drawerSlug);
				}}
				fieldSchema={fieldSchema}
				handleClose={() => {
					closeModal(drawerSlug);
				}}
			/>
		</Fragment>
	);
}
