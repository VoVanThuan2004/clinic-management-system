import { Modal } from "antd";
import type React from "react";

type Props = {
  title: string;
  open: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onClose: () => void;
  isLoading?: boolean;
  confirmLoading?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
};

export const AppModal = (props: Props) => {
  const {
    title,
    open,
    okText,
    cancelText,
    onOk,
    onClose,
    isLoading,
    confirmLoading,
    children,
    footer,
    width,
  } = props;

  return (
    <Modal
      destroyOnClose
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onClose}
      centered
      okText={okText}
      cancelText={cancelText}
      loading={isLoading}
      confirmLoading={confirmLoading}
      footer={footer}
      width={width}
    >
      {children}
    </Modal>
  );
};
