import Modal from "../ui/Modal";
import SettingsForm from "./SettingsForm";

export default function SettingsModal({ open }) {
  return (
    <Modal open={open} title="Project setup" wide>
      <SettingsForm forced />
    </Modal>
  );
}
