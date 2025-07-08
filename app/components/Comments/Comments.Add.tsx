import { Button, Label, Modal, ModalBody, ModalHeader, Textarea, ToggleSwitch } from "flowbite-react";
import { CommentsComment } from "./Comments.Comment";
import { useState } from "react";
import { ENDPOINTS } from "#/api/config";

export const CommentsAddModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  release_id: number;
  isReply?: boolean;
  parentComment?: any;
  parentProfile?: any;
  token: string;
  setShouldRender?: any;
  setCommentSend?: any;
  type?: "release" | "collection";
}) => {
  const [message, setMessage] = useState(
    props.isReply ? `${props.parentProfile.login}, ` : ""
  );
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSending, setIsSending] = useState(false);

  function _sendComment(e) {
    e.preventDefault();
    const re = /\n/gi;
    const data = {
      message: message.replace(re, "\r\n").trim(),
      parentCommentId: !props.parentComment ? null : props.parentComment.id,
      replyToProfileId: !props.parentProfile ? null : props.parentProfile.id,
      spoiler: isSpoiler,
    };

    async function _send() {
      let url;

      if (props.type == "collection") {
        url = `${ENDPOINTS.collection.base}/comment/add/${props.release_id}?token=${props.token}`;
      } else {
        url = `${ENDPOINTS.release.info}/comment/add/${props.release_id}?token=${props.token}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (props.isReply && props.setShouldRender && props.setCommentSend) {
        props.setShouldRender(true);
        props.setCommentSend(true);
      }

      setMessage(props.isReply ? `${props.parentProfile.login}, ` : "");
      setIsSpoiler(false);
      props.setIsOpen(false);
      setIsSending(false);
    }

    if (props.token && message.trim() != "") {
      setIsSending(true);
      _send();
    }
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <ModalHeader>
        <p className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
          {props.isReply ? "Ответ на комментарий" : "Оставить комментарий"}
        </p>
      </ModalHeader>
      <ModalBody>
        {props.isReply && (
          <div className="mb-4">
            <CommentsComment
              release_id={props.release_id}
              profile={props.parentProfile}
              comment={{
                id: props.parentComment.id,
                timestamp: props.parentComment.timestamp,
                message: props.parentComment.message,
                reply_count: props.parentComment.reply_count,
                likes_count: props.parentComment.likes_count,
                vote: props.parentComment.vote,
                isSpoiler: props.parentComment.isSpoiler,
                isEdited: props.parentComment.isEdited,
                isDeleted: props.parentComment.isDeleted,
              }}
              token={props.token}
              isReplying={true}
            />
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={(e) => _sendComment(e)}>
          <div>
            <div className="block mb-2 sr-only">
              <Label htmlFor="comment">Ваш комментарий.</Label>
            </div>
            <Textarea
              id="comment"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Написать комментарий..."
              required={true}
              rows={4}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ToggleSwitch
                color="blue"
                theme={{
                  toggle: {
                    checked: {
                      color: {
                        blue: "border-blue-700 bg-blue-700",
                      },
                    },
                  },
                }}
                checked={isSpoiler}
                onChange={() => setIsSpoiler(!isSpoiler)}
                label="Спойлер"
              />
            </div>
            <Button type="submit" color={"blue"} disabled={isSending}>
              Отправить
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
