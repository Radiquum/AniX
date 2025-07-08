import { Button, Label, Modal, ModalBody, ModalHeader, Textarea, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { ENDPOINTS } from "#/api/config";

export const CommentsEditModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  parentComment?: any;
  token: string;
  setShouldRender?: any;
  setCommentSend?: any;
  type?: "release" | "collection";
}) => {
  const [message, setMessage] = useState(props.parentComment.message);
  const [isSpoiler, setIsSpoiler] = useState(props.parentComment.isSpoiler);
  const [isSending, setIsSending] = useState(false);

  function _sendComment(e) {
    e.preventDefault();
    const re = /\n/gi;
    const data = {
      message: message.replace(re, "\r\n").trim(),
      spoiler: isSpoiler,
    };

    async function _send() {
      let url;
      if (props.type == "collection") {
        url = `${ENDPOINTS.collection.base}/comment/edit/${props.parentComment.id}?token=${props.token}`;
      } else {
        url = `${ENDPOINTS.release.info}/comment/edit/${props.parentComment.id}?token=${props.token}`;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (props.setShouldRender && props.setCommentSend) {
        props.setShouldRender(true);
        props.setCommentSend(true);
      }

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
          Редактировать комментарий
        </p>
      </ModalHeader>
      <ModalBody>
        <form className="flex flex-col gap-4" onSubmit={(e) => _sendComment(e)}>
          <div>
            <div className="block mb-2 sr-only">
              <Label htmlFor="comment" >Редактировать ваш комментарий.</Label>
            </div>
            <Textarea
              id="comment"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Редактировать комментарий..."
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
              Изменить
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
