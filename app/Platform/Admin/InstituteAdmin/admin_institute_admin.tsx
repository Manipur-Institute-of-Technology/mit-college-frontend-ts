import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient from "~/utils/apiClient";

import {
  Building2,
  Users,
  Shield,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  Save,
  FileText,
  Link as LinkIcon,
  Upload,
  ExternalLink,
  Download,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

export type GoverningBodyStructure = {
  _id?: string;
  position: string;
  role: string;
};

export type GoverningBodyMember = {
  _id?: string;
  name: string;
  background: string;
  role: string;
};

export type AdminDocument = {
  _id?: string;
  title: string;
  type: "file" | "link";
  file?: string;
  url?: string;
  uploadedAt?: string;
};

export type InstituteAdministrationData = {
  _id?: string;
  governingBodyStructure: GoverningBodyStructure[];
  governingBodyMembers: GoverningBodyMember[];
  documents: AdminDocument[];
};

// =====================================================
// COMPONENT
// =====================================================

export default function Admin_InstituteAdmin() {
  const { token, role } = useAuth();

  // ===================================================
  // STATE
  // ===================================================

  const [data, setData] =
    useState<InstituteAdministrationData | null>(null);

  const [structure, setStructure] =
    useState<GoverningBodyStructure[]>([]);

  const [members, setMembers] =
    useState<GoverningBodyMember[]>([]);

  const [documents, setDocuments] =
    useState<AdminDocument[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  // ===================================================
  // STRUCTURE STATE
  // ===================================================

  const [showStructureModal, setShowStructureModal] =
    useState(false);

  const [editingStructure, setEditingStructure] =
    useState<GoverningBodyStructure | null>(null);

  const [structureForm, setStructureForm] =
    useState({
      position: "",
      role: "",
    });

  const [savingStructure, setSavingStructure] =
    useState(false);

  // ===================================================
  // MEMBER STATE
  // ===================================================

  const [showMemberModal, setShowMemberModal] =
    useState(false);

  const [editingMember, setEditingMember] =
    useState<GoverningBodyMember | null>(null);

  const [memberForm, setMemberForm] =
    useState({
      name: "",
      background: "",
      role: "Member",
    });

  const [savingMember, setSavingMember] =
    useState(false);

  // ===================================================
  // DOCUMENT STATE
  // ===================================================

  const [showDocumentModal, setShowDocumentModal] =
    useState(false);

  const [editingDocument, setEditingDocument] =
    useState<AdminDocument | null>(null);

  const [documentForm, setDocumentForm] =
    useState({
      title: "",
      type: "file" as "file" | "link",
      url: "",
    });

  const [documentFile, setDocumentFile] =
    useState<File | null>(null);

  const [savingDocument, setSavingDocument] =
    useState(false);

  // ===================================================
  // FETCH DATA
  // ===================================================

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const res =
        await apiClient.get("/administrator");

      const fetched = res.data?.data;

      setData(fetched || null);

      setStructure(
        fetched?.governingBodyStructure || []
      );

      setMembers(
        fetched?.governingBodyMembers || []
      );

      setDocuments(
        fetched?.documents || []
      );
    } catch (error: any) {
      console.error(
        "FETCH ADMINISTRATION ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.error ||
          "Failed to fetch institute administration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {
    if (token && role === "admin") {
      fetchData();
    }
  }, [token, role]);

  // ===================================================
  // OPEN ADD STRUCTURE
  // ===================================================

  const openAddStructure = () => {
    setEditingStructure(null);

    setStructureForm({
      position: "",
      role: "",
    });

    setShowStructureModal(true);
  };

  // ===================================================
  // OPEN EDIT STRUCTURE
  // ===================================================

  const openEditStructure = (
    item: GoverningBodyStructure
  ) => {
    setEditingStructure(item);

    setStructureForm({
      position: item.position,
      role: item.role,
    });

    setShowStructureModal(true);
  };

  // ===================================================
  // ADD / EDIT STRUCTURE
  // ===================================================

  const handleStructureSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!structureForm.position.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Position Required",
        text: "Please enter the position.",
      });
      return;
    }

    if (!structureForm.role.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Role Required",
        text: "Please enter the role.",
      });
      return;
    }

    setSavingStructure(true);

    try {
      if (editingStructure?._id) {
        const res = await apiClient.put(
          `/administrator/structure/edit/${editingStructure._id}`,
          {
            position:
              structureForm.position.trim(),
            role:
              structureForm.role.trim(),
          }
        );

        setData(res.data?.data || null);

        setStructure(
          res.data?.data?.governingBodyStructure ||
            []
        );

        await Swal.fire({
          icon: "success",
          title: "Updated",
          text:
            "Governing body structure updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const res = await apiClient.post(
          "/administrator/structure/add",
          {
            position:
              structureForm.position.trim(),
            role:
              structureForm.role.trim(),
          }
        );

        setData(res.data?.data || null);

        setStructure(
          res.data?.data?.governingBodyStructure ||
            []
        );

        await Swal.fire({
          icon: "success",
          title: "Added",
          text:
            "Governing body structure added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setShowStructureModal(false);
      setEditingStructure(null);

      setStructureForm({
        position: "",
        role: "",
      });
    } catch (error: any) {
      console.error(
        "STRUCTURE SAVE ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.error ||
          "Failed to save structure.",
      });
    } finally {
      setSavingStructure(false);
    }
  };

  // ===================================================
  // DELETE STRUCTURE
  // ===================================================

  const deleteStructure = async (
    structureId?: string
  ) => {
    if (!structureId) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Structure?",
      text:
        "This governing body structure will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#be123c",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await apiClient.delete(
        `/administrator/structure/delete/${structureId}`
      );

      setData(res.data?.data || null);

      setStructure(
        res.data?.data?.governingBodyStructure ||
          []
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Structure deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error(
        "DELETE STRUCTURE ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.error ||
          "Failed to delete structure.",
      });
    }
  };

  // ===================================================
  // OPEN ADD MEMBER
  // ===================================================

  const openAddMember = () => {
    setEditingMember(null);

    setMemberForm({
      name: "",
      background: "",
      role: "Member",
    });

    setShowMemberModal(true);
  };

  // ===================================================
  // OPEN EDIT MEMBER
  // ===================================================

  const openEditMember = (
    member: GoverningBodyMember
  ) => {
    setEditingMember(member);

    setMemberForm({
      name: member.name,
      background: member.background || "",
      role: member.role,
    });

    setShowMemberModal(true);
  };

  // ===================================================
  // ADD / EDIT MEMBER
  // ===================================================

  const handleMemberSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!memberForm.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name Required",
        text: "Please enter member name.",
      });
      return;
    }

    if (!memberForm.role.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Role Required",
        text: "Please enter member role.",
      });
      return;
    }

    setSavingMember(true);

    try {
      if (editingMember?._id) {
        const res = await apiClient.put(
          `/administrator/member/edit/${editingMember._id}`,
          {
            name: memberForm.name.trim(),
            background:
              memberForm.background.trim(),
            role: memberForm.role.trim(),
          }
        );

        setData(res.data?.data || null);

        setMembers(
          res.data?.data?.governingBodyMembers ||
            []
        );

        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Member updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const res = await apiClient.post(
          "/administrator/member/add",
          {
            name: memberForm.name.trim(),
            background:
              memberForm.background.trim(),
            role: memberForm.role.trim(),
          }
        );

        setData(res.data?.data || null);

        setMembers(
          res.data?.data?.governingBodyMembers ||
            []
        );

        await Swal.fire({
          icon: "success",
          title: "Added",
          text: "Member added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setShowMemberModal(false);
      setEditingMember(null);

      setMemberForm({
        name: "",
        background: "",
        role: "Member",
      });
    } catch (error: any) {
      console.error(
        "MEMBER SAVE ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.error ||
          "Failed to save member.",
      });
    } finally {
      setSavingMember(false);
    }
  };

  // ===================================================
  // DELETE MEMBER
  // ===================================================

  const deleteMember = async (
    memberId?: string
  ) => {
    if (!memberId) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Member?",
      text:
        "This governing body member will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#be123c",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await apiClient.delete(
        `/administrator/member/delete/${memberId}`
      );

      setData(res.data?.data || null);

      setMembers(
        res.data?.data?.governingBodyMembers ||
          []
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Member deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error(
        "DELETE MEMBER ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.error ||
          "Failed to delete member.",
      });
    }
  };

  // ===================================================
  // OPEN ADD DOCUMENT
  // ===================================================

  const openAddDocument = () => {
    setEditingDocument(null);

    setDocumentForm({
      title: "",
      type: "file",
      url: "",
    });

    setDocumentFile(null);

    setShowDocumentModal(true);
  };

  // ===================================================
  // OPEN EDIT DOCUMENT
  // ===================================================

  const openEditDocument = (
    document: AdminDocument
  ) => {
    setEditingDocument(document);

    setDocumentForm({
      title: document.title || "",
      type: document.type || "file",
      url: document.url || "",
    });

    setDocumentFile(null);

    setShowDocumentModal(true);
  };

  // ===================================================
  // ADD / EDIT DOCUMENT
  // ===================================================

  const handleDocumentSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!documentForm.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title Required",
        text: "Please enter document title.",
      });
      return;
    }

    if (
      documentForm.type === "file" &&
      !editingDocument &&
      !documentFile
    ) {
      Swal.fire({
        icon: "warning",
        title: "File Required",
        text: "Please select a document file.",
      });
      return;
    }

    if (
      documentForm.type === "link" &&
      !documentForm.url.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Link Required",
        text: "Please enter document URL.",
      });
      return;
    }

    setSavingDocument(true);

    try {
      // =================================================
      // LINK DOCUMENT
      // =================================================

      if (documentForm.type === "link") {
        const body = {
          title: documentForm.title.trim(),
          type: "link",
          url: documentForm.url.trim(),
        };

        let res;

        if (editingDocument?._id) {
          res = await apiClient.put(
            `/administrator/document/edit/${editingDocument._id}`,
            body
          );
        } else {
          res = await apiClient.post(
            "/administrator/document/add",
            body
          );
        }

        setData(res.data?.data || null);

        setDocuments(
          res.data?.data?.documents || []
        );
      }

      // =================================================
      // FILE DOCUMENT
      // =================================================

      else {
        const formData = new FormData();

        formData.append(
          "title",
          documentForm.title.trim()
        );

        formData.append("type", "file");

        if (documentFile) {
          formData.append("file", documentFile);
        }

        let res;

        if (editingDocument?._id) {
          res = await apiClient.put(
            `/administrator/document/edit/${editingDocument._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          res = await apiClient.post(
            "/administrator/document/add",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );
        }

        setData(res.data?.data || null);

        setDocuments(
          res.data?.data?.documents || []
        );
      }

      await Swal.fire({
        icon: "success",
        title: editingDocument
          ? "Updated"
          : "Added",
        text: editingDocument
          ? "Document updated successfully."
          : "Document added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowDocumentModal(false);

      setEditingDocument(null);

      setDocumentForm({
        title: "",
        type: "file",
        url: "",
      });

      setDocumentFile(null);
    } catch (error: any) {
      console.error(
        "DOCUMENT SAVE ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.error ||
          "Failed to save document.",
      });
    } finally {
      setSavingDocument(false);
    }
  };

  // ===================================================
  // DELETE DOCUMENT
  // ===================================================

  const deleteDocument = async (
    documentId?: string
  ) => {
    if (!documentId) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Document?",
      text:
        "This document will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#be123c",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await apiClient.delete(
        `/administrator/document/delete/${documentId}`
      );

      setData(res.data?.data || null);

      setDocuments(
        res.data?.data?.documents || []
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Document deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error(
        "DELETE DOCUMENT ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.error ||
          "Failed to delete document.",
      });
    }
  };

  // ===================================================
  // AUTH CHECK
  // ===================================================

  if (!token || role !== "admin") {
    return (
      <div className="p-4">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="flex flex-col md:flex-row
        md:items-center justify-between gap-4
        border-b pb-4 border-gray-200"
      >
        <div>
          <h1
            className="text-3xl font-bold text-gray-800
            flex items-center gap-3"
          >
            <Building2 className="w-8 h-8 text-rose-700" />

            Institute Administration
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage the Governing Body structure,
            members and institute documents.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center justify-center gap-2
          px-4 py-2 bg-gray-100 hover:bg-gray-200
          text-gray-700 text-sm font-semibold
          rounded-lg border border-gray-300"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              isLoading ? "animate-spin" : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* =================================================
          STRUCTURE
      ================================================= */}

      <div
        className="bg-white rounded-2xl
        border border-gray-200 p-6 shadow-sm"
      >
        <div
          className="flex flex-col sm:flex-row
          sm:items-center justify-between gap-3
          border-b pb-4"
        >
          <div>
            <h2
              className="text-lg font-bold text-gray-800
              flex items-center gap-2"
            >
              <Shield className="w-5 h-5 text-rose-700" />

              Structure of the Governing Body
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Add and manage governing body positions.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddStructure}
            className="text-xs bg-rose-700
            hover:bg-rose-800 text-white
            font-bold px-4 py-2 rounded-lg
            flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />

            Add Structure
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {structure.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Shield
                className="w-10 h-10 mx-auto mb-2 opacity-30"
              />

              <p className="text-sm">
                No governing body structure found.
              </p>

              <p className="text-xs mt-1">
                Click "Add Structure" to add one.
              </p>
            </div>
          ) : (
            structure.map((item, index) => (
              <div
                key={item._id || index}
                className="flex flex-col sm:flex-row
                sm:items-center gap-3 bg-gray-50 p-4
                rounded-xl border border-gray-200"
              >
                <div
                  className="flex items-center gap-3 flex-1"
                >
                  <span
                    className="font-mono font-bold
                    text-gray-400 text-xs w-6 text-center"
                  >
                    {index + 1}
                  </span>

                  <div>
                    <p
                      className="font-bold text-gray-900
                      text-sm"
                    >
                      {item.position}
                    </p>

                    <p
                      className="text-xs text-gray-500 mt-1"
                    >
                      {item.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openEditStructure(item)
                    }
                    className="p-2 text-blue-600
                    hover:text-blue-800
                    hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteStructure(item._id)
                    }
                    className="p-2 text-red-500
                    hover:text-red-700
                    hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =================================================
          MEMBERS
      ================================================= */}

      <div
        className="bg-white rounded-2xl
        border border-gray-200 p-6 shadow-sm"
      >
        <div
          className="flex flex-col sm:flex-row
          sm:items-center justify-between gap-3
          border-b pb-4"
        >
          <div>
            <h2
              className="text-lg font-bold text-gray-800
              flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-rose-700" />

              Governing Body Members
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Manage members of the governing body.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddMember}
            className="text-xs bg-rose-700
            hover:bg-rose-800 text-white
            font-bold px-4 py-2 rounded-lg
            flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />

            Add Member
          </button>
        </div>

        <div className="overflow-x-auto mt-5">
          {members.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Users
                className="w-10 h-10 mx-auto mb-2 opacity-30"
              />

              <p className="text-sm">
                No governing body members found.
              </p>

              <p className="text-xs mt-1">
                Click "Add Member" to add one.
              </p>
            </div>
          ) : (
            <table
              className="w-full text-left text-sm
              text-gray-700"
            >
              <thead
                className="bg-gray-100 uppercase
                text-xs text-gray-600"
              >
                <tr>
                  <th
                    className="px-4 py-3 font-bold
                    w-12 text-center"
                  >
                    #
                  </th>

                  <th className="px-4 py-3 font-bold">
                    Member Name
                  </th>

                  <th className="px-4 py-3 font-bold">
                    Professional Background
                  </th>

                  <th className="px-4 py-3 font-bold">
                    Role
                  </th>

                  <th
                    className="px-4 py-3 font-bold
                    text-right"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody
                className="divide-y divide-gray-200"
              >
                {members.map(
                  (member, index) => (
                    <tr
                      key={
                        member._id || index
                      }
                      className="hover:bg-gray-50"
                    >
                      <td
                        className="px-4 py-3 text-center
                        font-mono text-gray-400 font-bold"
                      >
                        {index + 1}
                      </td>

                      <td
                        className="px-4 py-3 font-bold
                        text-gray-900"
                      >
                        {member.name}
                      </td>

                      <td
                        className="px-4 py-3
                        text-gray-600 text-xs"
                      >
                        {member.background ||
                          "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className="px-3 py-1 bg-gray-100
                          border border-gray-200
                          text-gray-800 text-xs
                          font-bold rounded-full"
                        >
                          {member.role}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div
                          className="flex justify-end gap-2"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEditMember(
                                member
                              )
                            }
                            className="p-2 text-blue-600
                            hover:text-blue-800
                            hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteMember(
                                member._id
                              )
                            }
                            className="p-2 text-red-500
                            hover:text-red-700
                            hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* =================================================
          DOCUMENTS
      ================================================= */}

      <div
        className="bg-white rounded-2xl
        border border-gray-200 p-6 shadow-sm"
      >
        <div
          className="flex flex-col sm:flex-row
          sm:items-center justify-between gap-3
          border-b pb-4"
        >
          <div>
            <h2
              className="text-lg font-bold text-gray-800
              flex items-center gap-2"
            >
              <FileText className="w-5 h-5 text-rose-700" />

              Institute Documents
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Upload documents or add external document
              links.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddDocument}
            className="text-xs bg-rose-700
            hover:bg-rose-800 text-white
            font-bold px-4 py-2 rounded-lg
            flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />

            Add Document
          </button>
        </div>

        <div className="mt-5">
          {documents.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FileText
                className="w-10 h-10 mx-auto mb-2 opacity-30"
              />

              <p className="text-sm">
                No documents found.
              </p>

              <p className="text-xs mt-1">
                Click "Add Document" to upload a file
                or add a link.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map(
                (document, index) => (
                  <div
                    key={
                      document._id || index
                    }
                    className="flex flex-col lg:flex-row
                    lg:items-center gap-4 p-4
                    bg-gray-50 border border-gray-200
                    rounded-xl"
                  >
                    {/* ICON */}

                    <div
                      className="w-11 h-11 rounded-xl
                      bg-white border border-gray-200
                      flex items-center justify-center
                      shrink-0"
                    >
                      {document.type === "link" ? (
                        <LinkIcon
                          className="w-5 h-5
                          text-blue-600"
                        />
                      ) : (
                        <FileText
                          className="w-5 h-5
                          text-rose-700"
                        />
                      )}
                    </div>

                    {/* INFORMATION */}

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-bold
                        text-gray-900 text-sm"
                      >
                        {document.title}
                      </p>

                      <div
                        className="flex flex-wrap
                        items-center gap-2 mt-1"
                      >
                        <span
                          className="text-[10px]
                          uppercase font-bold
                          px-2 py-1 rounded-full
                          bg-gray-200 text-gray-700"
                        >
                          {document.type}
                        </span>

                        {document.uploadedAt && (
                          <span
                            className="text-xs
                            text-gray-400"
                          >
                            {new Date(
                              document.uploadedAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {document.type === "link" &&
                        document.url && (
                          <p
                            className="text-xs
                            text-blue-600 mt-2
                            truncate max-w-xl"
                          >
                            {document.url}
                          </p>
                        )}

                      {document.type === "file" &&
                        document.file && (
                          <p
                            className="text-xs
                            text-gray-500 mt-2
                            truncate max-w-xl"
                          >
                            {document.file}
                          </p>
                        )}
                    </div>

                    {/* ACTIONS */}

                    <div
                      className="flex items-center
                      gap-2 shrink-0"
                    >
                      {document.type === "link" &&
                        document.url && (
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600
                            hover:text-blue-800
                            hover:bg-blue-50 rounded-lg"
                            title="Open Link"
                          >
                            <ExternalLink
                              className="w-4 h-4"
                            />
                          </a>
                        )}

                      {document.type === "file" &&
                        document.file && (
                          <a
                            href={document.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-green-600
                            hover:text-green-800
                            hover:bg-green-50 rounded-lg"
                            title="Download / Open"
                          >
                            <Download
                              className="w-4 h-4"
                            />
                          </a>
                        )}

                      <button
                        type="button"
                        onClick={() =>
                          openEditDocument(
                            document
                          )
                        }
                        className="p-2 text-blue-600
                        hover:text-blue-800
                        hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteDocument(
                            document._id
                          )
                        }
                        className="p-2 text-red-500
                        hover:text-red-700
                        hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          STRUCTURE MODAL
      ================================================= */}

      {showStructureModal && (
        <div
          className="fixed inset-0 z-50 flex
          items-center justify-center bg-black/50
          backdrop-blur-sm p-4"
          onClick={() =>
            setShowStructureModal(false)
          }
        >
          <div
            className="bg-white rounded-2xl shadow-2xl
            p-6 w-full max-w-md"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              className="flex items-center
              justify-between border-b pb-3"
            >
              <h3 className="font-bold text-gray-800">
                {editingStructure
                  ? "Edit Governing Body Structure"
                  : "Add Governing Body Structure"}
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowStructureModal(false)
                }
                className="p-1 text-gray-400
                hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleStructureSubmit}
              className="space-y-4 mt-5"
            >
              <div>
                <label
                  className="block text-xs font-bold
                  text-gray-700 mb-1"
                >
                  Position *
                </label>

                <input
                  type="text"
                  value={
                    structureForm.position
                  }
                  onChange={(e) =>
                    setStructureForm({
                      ...structureForm,
                      position:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Vice-Chancellor"
                  className="w-full border border-gray-300
                  rounded-lg p-2.5 text-sm
                  focus:ring-2 focus:ring-rose-500
                  focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold
                  text-gray-700 mb-1"
                >
                  Role *
                </label>

                <input
                  type="text"
                  value={structureForm.role}
                  onChange={(e) =>
                    setStructureForm({
                      ...structureForm,
                      role: e.target.value,
                    })
                  }
                  placeholder="e.g. Chairman"
                  className="w-full border border-gray-300
                  rounded-lg p-2.5 text-sm
                  focus:ring-2 focus:ring-rose-500
                  focus:outline-none"
                />
              </div>

              <div
                className="flex justify-end gap-2
                pt-3 border-t"
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowStructureModal(false)
                  }
                  className="px-4 py-2 bg-gray-100
                  hover:bg-gray-200 text-gray-700
                  text-sm font-semibold rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingStructure}
                  className="px-4 py-2 bg-rose-700
                  hover:bg-rose-800 disabled:opacity-50
                  text-white text-sm font-bold
                  rounded-lg flex items-center gap-2"
                >
                  {editingStructure ? (
                    <Edit2 className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}

                  {savingStructure
                    ? "Saving..."
                    : editingStructure
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          MEMBER MODAL
      ================================================= */}

      {showMemberModal && (
        <div
          className="fixed inset-0 z-50 flex
          items-center justify-center bg-black/50
          backdrop-blur-sm p-4"
          onClick={() =>
            setShowMemberModal(false)
          }
        >
          <div
            className="bg-white rounded-2xl shadow-2xl
            p-6 w-full max-w-md"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              className="flex items-center
              justify-between border-b pb-3"
            >
              <h3 className="font-bold text-gray-800">
                {editingMember
                  ? "Edit Governing Body Member"
                  : "Add Governing Body Member"}
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowMemberModal(false)
                }
                className="p-1 text-gray-400
                hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleMemberSubmit}
              className="space-y-4 mt-5"
            >
              <div>
                <label
                  className="block text-xs font-bold
                  text-gray-700 mb-1"
                >
                  Member Name *
                </label>

                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Prof. N. Lokendra Singh"
                  className="w-full border border-gray-300
                  rounded-lg p-2.5 text-sm
                  focus:ring-2 focus:ring-rose-500
                  focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold
                  text-gray-700 mb-1"
                >
                  Professional Background
                </label>

                <input
                  type="text"
                  value={
                    memberForm.background
                  }
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      background:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Professor, Manipur University"
                  className="w-full border border-gray-300
                  rounded-lg p-2.5 text-sm
                  focus:ring-2 focus:ring-rose-500
                  focus:outline-none"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold
                  text-gray-700 mb-1"
                >
                  Role *
                </label>

                <input
                  type="text"
                  value={memberForm.role}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      role: e.target.value,
                    })
                  }
                  placeholder="e.g. Member / Chairman"
                  className="w-full border border-gray-300
                  rounded-lg p-2.5 text-sm
                  focus:ring-2 focus:ring-rose-500
                  focus:outline-none"
                />
              </div>

              <div
                className="flex justify-end gap-2
                pt-3 border-t"
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowMemberModal(false)
                  }
                  className="px-4 py-2 bg-gray-100
                  hover:bg-gray-200 text-gray-700
                  text-sm font-semibold rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingMember}
                  className="px-4 py-2 bg-rose-700
                  hover:bg-rose-800 disabled:opacity-50
                  text-white text-sm font-bold
                  rounded-lg flex items-center gap-2"
                >
                  {editingMember ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}

                  {savingMember
                    ? "Saving..."
                    : editingMember
                    ? "Update Member"
                    : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          DOCUMENT MODAL
      ================================================= */}

      {showDocumentModal && (
        <div
          className="fixed inset-0 z-50 flex
          items-center justify-center bg-black/50
          backdrop-blur-sm p-4"
          onClick={() =>
            setShowDocumentModal(false)
          }
        >
          <div
            className="bg-white rounded-2xl
            shadow-2xl p-6 w-full max-w-md"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}

            <div
              className="flex items-center
              justify-between border-b pb-3"
            >
              <div>
                <h3 className="font-bold text-gray-800">
                  {editingDocument
                    ? "Edit Document"
                    : "Add Document"}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Upload a file or add an external link.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDocumentModal(false)
                }
                className="p-1 text-gray-400
                hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleDocumentSubmit}
              className="space-y-4 mt-5"
            >
              {/* TITLE */}

              <div>
                <label
                  className="block text-xs font-bold
                  text-gray-700 mb-1"
                >
                  Document Title *
                </label>

                <input
                  type="text"
                  value={documentForm.title}
                  onChange={(e) =>
                    setDocumentForm({
                      ...documentForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Institute Annual Report 2025"
                  className="w-full border border-gray-300
                  rounded-lg p-2.5 text-sm
                  focus:ring-2 focus:ring-rose-500
                  focus:outline-none"
                  autoFocus
                />
              </div>

              {/* TYPE */}

              <div>
                <label
                  className="block text-xs font-bold
                  text-gray-700 mb-2"
                >
                  Document Type *
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* FILE */}

                  <button
                    type="button"
                    onClick={() =>
                      setDocumentForm({
                        ...documentForm,
                        type: "file",
                      })
                    }
                    className={`border rounded-xl
                    p-4 text-left transition
                    ${
                      documentForm.type === "file"
                        ? "border-rose-600 bg-rose-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <FileText
                      className={`w-5 h-5 mb-2 ${
                        documentForm.type === "file"
                          ? "text-rose-700"
                          : "text-gray-500"
                      }`}
                    />

                    <p className="font-bold text-sm">
                      Upload File
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1">
                      PDF, DOC, XLSX, etc.
                    </p>
                  </button>

                  {/* LINK */}

                  <button
                    type="button"
                    onClick={() =>
                      setDocumentForm({
                        ...documentForm,
                        type: "link",
                      })
                    }
                    className={`border rounded-xl
                    p-4 text-left transition
                    ${
                      documentForm.type === "link"
                        ? "border-rose-600 bg-rose-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <LinkIcon
                      className={`w-5 h-5 mb-2 ${
                        documentForm.type === "link"
                          ? "text-rose-700"
                          : "text-gray-500"
                      }`}
                    />

                    <p className="font-bold text-sm">
                      External Link
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1">
                      Google Drive, website, etc.
                    </p>
                  </button>
                </div>
              </div>

              {/* FILE INPUT */}

              {documentForm.type === "file" && (
                <div>
                  <label
                    className="block text-xs font-bold
                    text-gray-700 mb-1"
                  >
                    Select Document{" "}
                    {!editingDocument && "*"}
                  </label>

                  <label
                    className="w-full border-2
                    border-dashed border-gray-300
                    hover:border-rose-400 rounded-xl
                    p-5 flex flex-col
                    items-center justify-center
                    cursor-pointer bg-gray-50
                    hover:bg-rose-50 transition"
                  >
                    <Upload
                      className="w-7 h-7
                      text-gray-400 mb-2"
                    />

                    <span
                      className="text-sm font-semibold
                      text-gray-700 text-center"
                    >
                      {documentFile
                        ? documentFile.name
                        : editingDocument
                        ? "Choose a new file (optional)"
                        : "Click to select a file"}
                    </span>

                    <span
                      className="text-xs text-gray-400
                      mt-1"
                    >
                      Select your document file
                    </span>

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file =
                          e.target.files?.[0] ||
                          null;

                        setDocumentFile(file);
                      }}
                    />
                  </label>

                  {editingDocument &&
                    editingDocument.file &&
                    !documentFile && (
                      <p
                        className="text-xs
                        text-gray-500 mt-2"
                      >
                        Existing file will be kept if
                        no new file is selected.
                      </p>
                    )}
                </div>
              )}

              {/* LINK INPUT */}

              {documentForm.type === "link" && (
                <div>
                  <label
                    className="block text-xs font-bold
                    text-gray-700 mb-1"
                  >
                    Document URL *
                  </label>

                  <input
                    type="url"
                    value={documentForm.url}
                    onChange={(e) =>
                      setDocumentForm({
                        ...documentForm,
                        url: e.target.value,
                      })
                    }
                    placeholder="https://example.com/document.pdf"
                    className="w-full border border-gray-300
                    rounded-lg p-2.5 text-sm
                    focus:ring-2 focus:ring-rose-500
                    focus:outline-none"
                  />
                </div>
              )}

              {/* ACTIONS */}

              <div
                className="flex justify-end gap-2
                pt-3 border-t"
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowDocumentModal(false)
                  }
                  className="px-4 py-2 bg-gray-100
                  hover:bg-gray-200 text-gray-700
                  text-sm font-semibold rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingDocument}
                  className="px-4 py-2 bg-rose-700
                  hover:bg-rose-800 disabled:opacity-50
                  text-white text-sm font-bold
                  rounded-lg flex items-center gap-2"
                >
                  {editingDocument ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}

                  {savingDocument
                    ? "Saving..."
                    : editingDocument
                    ? "Update Document"
                    : "Add Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}