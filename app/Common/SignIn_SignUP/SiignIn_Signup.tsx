import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { useAuth } from "~/context/AuthContext";
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const departments = [
  { name: "Computer Science and Engineering", code: "CSE" },
  { name: "Electronics & Communication Engineering", code: "ECE" },
  { name: "Civil Engineering", code: "CE" },
  { name: "Basic Sciences & Humanities", code: "BSH" },
  { name: "Mechanical Engineering", code: "ME" },
  { name: "Electrical Engineering", code: "EE" },
];

type Props = {
  role: "admin" | "faculty";
};

export default function SignIn_SignUP({ role }: Props) {
  const { setToken, setRole } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_No: "",
    speacility: "",
    qualification: "",
    department: "",
    dept_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [proceedToForm, setProceedToForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [confirmEditing, setConfirmEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password") setPasswordEditing(true);
    if (e.target.name === "confirmPassword") setConfirmEditing(true);
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = departments.find((d) => d.name === e.target.value);
    setFormData({
      ...formData,
      department: selected?.name || "",
      dept_code: selected?.code || "",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isStrongPassword = (password: string) => {
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
    );
  };

  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      setLoading(false);

      if (formData.password === "wrong") {
        setMessage("Invalid password or recovery code.");
      } else {
        const fakeToken = "fake-jwt-token";
        localStorage.setItem("token", fakeToken);
        localStorage.setItem("role", role);
        setToken(fakeToken);
        setRole(role);
        setMessage(isSignUp ? "Account created!" : "Signed in successfully!");
        setShowModal(false);
        setProceedToForm(false);
      }
    }, 1500);
  };

  useEffect(() => {
    if (proceedToForm && role === "faculty") {
      setShowModal(true);
    }
  }, [proceedToForm, role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <AnimatePresence mode="wait">
          <motion.form
            key={isSignUp ? "signup" : "signin"}
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isSignUp && !proceedToForm && (
              <>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2 border rounded-lg pr-10"
                  />
                  <span
                    className="absolute top-[35px] right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {passwordEditing && (
                    <p
                      className={`text-sm mt-1 ${
                        isStrongPassword(formData.password)
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {isStrongPassword(formData.password)
                        ? "Strong Password"
                        : "Weak Password (use 8+ chars, numbers, caps)"}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2 border rounded-lg pr-10"
                  />
                  <span
                    className="absolute top-[35px] right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {confirmEditing && (
                    <p
                      className={`text-sm mt-1 ${
                        passwordsMatch ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {passwordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                  onClick={() => setProceedToForm(true)}
                >
                  Next
                </button>
              </>
            )}

            {!isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium">
                    {role === "faculty" && isRecovery
                      ? "Recovery Code"
                      : "Password"}
                  </label>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2 border rounded-lg pr-10"
                  />
                  <span
                    className="absolute top-[35px] right-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {role === "faculty" && (
                    <label className="inline-flex items-center mt-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isRecovery}
                        onChange={() => setIsRecovery(!isRecovery)}
                        className="mr-2"
                      />
                      Use Recovery Code
                    </label>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  {loading ? "Please wait..." : "Sign In"}
                </button>
              </>
            )}
            {message && (
              <p className="text-center text-sm text-red-600 mt-2">{message}</p>
            )}
          </motion.form>
        </AnimatePresence>

        {role === "faculty" && (
          <p className="text-sm text-center mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="text-indigo-600 font-medium hover:underline"
              onClick={() => {
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  phone_No: "",
                  speacility: "",
                  qualification: "",
                  department: "",
                  dept_code: "",
                });
                setIsSignUp(!isSignUp);
                setMessage("");
              }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <Dialog
            open={showModal}
            onClose={() => setShowModal(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
              <motion.div
                className="bg-white p-6 rounded-xl w-full max-w-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <Dialog.Title className="relative text-lg font-bold mb-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setProceedToForm(false);
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-xl text-gray-600 hover:text-indigo-600"
                  >
                    &lt;
                  </button>
                  Complete Registration
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div
                    className="w-32 h-32 bg-gray-100 mx-auto rounded-md overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 text-center">
                        Click to Upload
                      </span>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </div>
                  <input
                    name="phone_No"
                    placeholder="Phone Number"
                    value={formData.phone_No}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    name="speacility"
                    placeholder="Speciality"
                    value={formData.speacility}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                  <input
                    name="qualification"
                    placeholder="Qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleDeptChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.code} value={dept.name}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                  <input
                    name="dept_code"
                    placeholder="Department Code"
                    value={formData.dept_code}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-2 rounded-lg"
                  >
                    Register
                  </button>
                </form>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
