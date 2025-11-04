"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@heroui/react";
import { ChevronDown, Plus, Search, EllipsisVertical } from "lucide-react";

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export default function DataTable({
  columns = [],
  data = [],
  statusOptions = [],
  statusColorMap = {},
  searchPlaceholder = "Search...",
  emptyContent = "No data found",
  itemName = "items",
  onAddNew,
  onView,
  onEdit,
  renderCustomCell,
}) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: columns[0]?.uid || "id",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filtered = [...data];
    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }
    if (
      statusFilter !== "all" &&
      statusOptions.length > 0 &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filtered = filtered.filter((item) =>
        Array.from(statusFilter).includes(item.status)
      );
    }
    return filtered;
  }, [data, filterValue, statusFilter, statusOptions.length, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];
      if (renderCustomCell) {
        const customRender = renderCustomCell(item, columnKey);
        if (customRender !== undefined) return customRender;
      }
      switch (columnKey) {
        case "status":
          return (
            <Chip
              className="capitalize text-white"
              color={statusColorMap[item.status] || "default"}
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center w-full h-full p-2 gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light">
                    <EllipsisVertical />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {onView && (
                    <DropdownItem key="view" onPress={() => onView(item)}>
                      View
                    </DropdownItem>
                  )}
                  {onEdit && (
                    <DropdownItem key="edit" onPress={() => onEdit(item)}>
                      Edit
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [statusColorMap, renderCustomCell, onView, onEdit]
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) setPage(page + 1);
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-fit gap-2">
        <div className="flex flex-row items-center justify-center w-full h-full gap-2">
          <Input
            isClearable
            placeholder={searchPlaceholder}
            startContent={<Search />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
            radius="none"
            variant="faded"
          />
          {statusOptions.length > 0 && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  color="default"
                  endContent={<ChevronDown />}
                  radius="none"
                  className="w-28 p-2 gap-2 text-dark font-semibold"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {onAddNew && (
            <Button
              startContent={<Plus />}
              color="primary"
              onPress={onAddNew}
              radius="none"
              className="w-28 p-2 gap-2 text-white font-semibold"
            >
              Add New
            </Button>
          )}
        </div>
        <div className="flex flex-row items-center justify-between w-full h-full gap-2">
          <div className="flex items-center justify-between w-full h-full p-2 gap-2">
            Total {data.length} {itemName}
          </div>
          <label className="flex items-center justify-between w-fit h-full p-2 gap-2 whitespace-nowrap">
            Rows per page:
            <select
              className="flex items-center justify-between w-fit h-full p-2 gap-2"
              onChange={onRowsPerPageChange}
              defaultValue="5"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    searchPlaceholder,
    statusOptions,
    onAddNew,
    data.length,
    itemName,
    onRowsPerPageChange,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex flex-row items-center justify-center w-full h-fit gap-2">
        <div className="flex items-center justify-end w-full h-full p-2 gap-2">
          <Pagination
            isCompact
            showControls
            showShadow
            color="warning"
            radius="none"
            page={page}
            total={pages}
            onChange={setPage}
          />
        </div>
      </div>
    );
  }, [page, pages]);

  return (
    <Table
      aria-label="Data table with sorting and pagination"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{ wrapper: "max-h-[500px]" }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
      radius="none"
      shadow="none"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            className="bg-dark text-white p-4 gap-2"
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={emptyContent} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell className="border-b-1 border-dark">
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
