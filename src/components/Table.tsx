import { Table, type TableProps } from "antd";

type BaseTableProps<T> = TableProps<T>;

export function BaseTable<T extends object>(props: BaseTableProps<T>) {
  return (
    <div className="mt-5 mb-5 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <Table<T>
        {...props}
        scroll={{ x: 1000 }}
        className="[&_.ant-table]:rounded-2xl"
      />
    </div>
  );
}