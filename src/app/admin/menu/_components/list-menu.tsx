"use client";

import React, { useState } from "react";
import { Edit, Plus, Trash2, Check } from "lucide-react";
import Image from "next/image";
import { MenuType, type Category, type Prisma } from "@prisma/client";
import { Modal } from "../../_components/modal";
import { SubmitButton } from "./submit-button";
import { useFormState } from "react-dom";
import { addMenu, deleteMenu, updateMenu } from "@/actions/menu";
import { ErrorMessage } from "../../_components/error-message";
import { MobileMenuCard } from "./mobile-card";
import { Alert } from "../../_components/alert";
import { useRouter } from "next/navigation";
import { Tabel, type TabelColumn } from "../../_components/tabel";
import { FilterControl1 } from "./filter-control";

type MenuWithCategory = Prisma.MenuGetPayload<{
  include: { categories: true };
}>;

const menuTypeList = [
  {
    value: "FOOD",
    label: "Makanan",
  },
  {
    value: "BEVERAGE",
    label: "Minuman",
  },
  {
    value: "OTHER",
    label: "Lainnya",
  },
];

interface Props {
  menuData: MenuWithCategory[];
  categories: Category[];
  currentSortMenu?: string;
  modal?: string;
}

export const ListMenu = ({
  menuData,
  categories,
  modal,
  currentSortMenu,
}: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [stock, setStock] = useState("");
  const [menuType, setMenuType] = useState<MenuType>();
  const [selectedMenu, setSelectedMenu] = useState<MenuWithCategory | null>(
    null
  );

  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
    onConfirm: (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    onConfirm: null,
  });

  const [createState, createAction] = useFormState(addMenu, { error: null });
  const [updateState, updateAction] = useFormState(updateMenu, { error: null });
  const isModalOpen = modal === "add" || modal === "edit";
  const router = useRouter();

  const handleAddClick = () => {
    router.push("/admin/menu?modal=add");
    setPreviewImage(null);
  };

  const handleCloseModal = () => {
    router.push("/admin/menu");
    setTimeout(() => {
      setPreviewImage(null);
      setMenuType("FOOD");
      setStock("");
      setSelectedMenu(null);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setAlert({
      isOpen: true,
      title: "Hapus Menu",
      message: "Apakah anda yakin ingin menghapus menu ini?",
      type: "warning",
      onConfirm: () => deleteMenu(id),
    });
  };

  const handleEditItem = (item: MenuWithCategory) => {
    setSelectedMenu(item);
    setMenuType(item.menuType);
    setStock(item.status ? "Tersedia" : "Kosong");
    router.push(`/admin/menu?modal=edit`);
  };

  const columns: TabelColumn<MenuWithCategory>[] = [
    {
      header: "No",
      accessor: "id",
      render: (_, index) => (index as number) + 1,
    },
    {
      header: "Menu",
      accessor: "name",
    },
    {
      header: "Tipe Menu",
      accessor: (item) => {
        return item.menuType === "BEVERAGE"
          ? "Minuman"
          : item.menuType === "FOOD"
          ? "Makanan"
          : "Lainnya";
      },
    },
    {
      header: "Kategori",
      accessor: (item) => item.categories.map((cat) => cat.name).join(", "),
    },
    {
      header: "Harga",
      accessor: (item) => `Rp ${item.price.toLocaleString("id-ID")}`,
    },
    {
      header: "Stok",
      accessor: (item) => item.status,
      render: (item) => (
        <span
          className={`px-3 py-1 border-2 border-neutral-700 text-sm font-bold ${
            item.status ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {item.status ? "Tersedia" : "Tidak Tersedia"}
        </span>
      ),
    },
    {
      header: "Gambar",
      accessor: (item) => item.image,
      render: (item) => (
        <div className="border-2 w-20 h-20 overflow-hidden border-neutral-700 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
          <Image
            src={item.image!}
            alt={item.name}
            width={400}
            height={400}
            className="w-full h-full object-center object-cover"
          />
        </div>
      ),
    },
    {
      header: "Aksi",
      accessor: (item) => item.id,
      render: (item) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleEditItem(item)}
            className="bg-yellow-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
          >
            <Edit className="mr-1 w-4 h-4" strokeWidth={2.5} /> Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="bg-red-600 text-white border-2 border-neutral-700 px-3 py-1 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center disabled:opacity-50"
          >
            <>
              <Trash2 className="mr-1 w-4 h-4" strokeWidth={2.5} /> Hapus
            </>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-indigo-500 pb-2 text-black">
          Daftar Menu
        </h1>
        <button
          onClick={handleAddClick}
          className="bg-indigo-600 text-white border-4 border-neutral-700 px-6 py-3 font-bold shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all w-full sm:w-auto flex items-center justify-center"
        >
          <Plus className="mr-2 w-5 h-5" strokeWidth={2.5} /> Tambah Menu
        </button>
      </div>

      <FilterControl1
        categories={categories}
        currentSortMenu={currentSortMenu}
      />

      <div className="md:hidden space-y-4">
        {menuData.map((item, index) => (
          <MobileMenuCard
            index={index}
            key={item.id}
            item={item}
            onDeleteClick={handleDelete}
            onEditClick={handleEditItem}
          />
        ))}
      </div>

      <div className="hidden md:block bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <Tabel columns={columns} data={menuData} />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl md:text-3xl font-black mb-6 border-b-4 border-indigo-500 pb-2 text-neutral-800">
          {modal === "add" ? "Tambah Menu" : "Edit Menu"}
        </h2>
        <form
          className="overflow-y-auto max-h-[calc(100vh-200px)]"
          action={modal === "add" ? createAction : updateAction}
        >
          <input
            type="hidden"
            name="id"
            defaultValue={selectedMenu?.id}
            value={selectedMenu?.id}
          />
          {createState.error || updateState.error ? (
            <ErrorMessage message={createState.error || updateState.error} />
          ) : null}
          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Menu
            </label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan menu"
              className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-indigo-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
              required
              defaultValue={selectedMenu?.name}
            />
          </div>

          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Kategori
            </label>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center space-x-2 text-neutral-800"
                >
                  <input
                    type="checkbox"
                    name="category"
                    value={cat.id}
                    className="accent-indigo-600"
                    defaultChecked={selectedMenu?.categories.some(
                      (c) => c.id === cat.id
                    )}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Harga
            </label>
            <input
              type="number"
              placeholder="Masukkan harga"
              className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-indigo-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-white text-neutral-800"
              required
              name="price"
              defaultValue={selectedMenu?.price}
            />
          </div>

          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Tipe Menu
            </label>
            <div className="flex space-x-6">
              {menuTypeList.map((type) => (
                <label
                  key={type.value}
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="radio"
                      name="menuType"
                      value={type.value}
                      checked={menuType === type.value}
                      onChange={(e) => setMenuType(e.target.value as MenuType)}
                      className="sr-only"
                      defaultChecked={selectedMenu?.menuType === type.value}
                    />
                    <div
                      className={`w-6 h-6 border-2 border-neutral-300 ${
                        type.value === menuType
                          ? "bg-green-500"
                          : "bg-neutral-200"
                      } mr-2 flex items-center justify-center`}
                    >
                      {type.value === menuType && (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>
                  <span className="text-neutral-800 font-bold">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Stok
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="stock"
                    value="Tersedia"
                    checked={stock === "Tersedia"}
                    onChange={(e) => setStock(e.target.value)}
                    className="sr-only"
                    defaultChecked={selectedMenu?.status}
                  />
                  <div
                    className={`w-6 h-6 border-2 border-neutral-300 ${
                      stock === "Tersedia" ? "bg-green-500" : "bg-neutral-200"
                    } mr-2 flex items-center justify-center`}
                  >
                    {stock === "Tersedia" && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>
                <span className="text-neutral-800 font-bold">Tersedia</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="stock"
                    value="Kosong"
                    checked={stock === "Kosong"}
                    onChange={(e) => setStock(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 border-2 border-neutral-300 ${
                      stock === "Kosong" ? "bg-red-500" : "bg-neutral-200"
                    } mr-2 flex items-center justify-center`}
                  >
                    {stock === "Kosong" && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>
                <span className="text-neutral-800 font-bold">Kosong</span>
              </label>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-neutral-800 mb-2 font-bold">
              Gambar
            </label>
            <div className="w-full px-4 py-3 border-3 border-neutral-300 rounded-none focus:outline-none focus:ring-0 focus:border-indigo-600 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)] bg-neutral-100">
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-sm text-neutral-800 font-bold cursor-pointer"
              />
            </div>
            {(previewImage || selectedMenu?.image) && (
              <div className="mt-3 flex justify-center sm:justify-start">
                <div className="border-3 border-neutral-300 shadow-[3px_3px_0px_0px_rgba(230,230,230,1)]">
                  <Image
                    width={400}
                    height={400}
                    src={previewImage || (selectedMenu?.image as string)}
                    alt="Preview"
                    className="w-32 h-32 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={handleCloseModal}
              className="py-3 px-4 bg-neutral-200 text-neutral-800 border-4 border-neutral-300 font-bold shadow-[4px_4px_0px_0px_rgba(230,230,230,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(230,230,230,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
            >
              Batal
            </button>
            <SubmitButton modalMode={modal as "add" | "edit"} />
          </div>
        </form>
      </Modal>

      <Alert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={alert.onConfirm}
      />
    </div>
  );
};
