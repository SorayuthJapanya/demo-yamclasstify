import React from "react";
import { Link } from "react-router-dom";
import EditForm from "../../components/auth/EditForm"

const SignupPage = () => {
  return (
    <div className="min-h-160 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center my-10">
        <div className="bg-content/10 rounded-lg shadow-2xl max-w-lg w-full px-8 py-2 ">
          <EditForm />
        </div>
        <Link to={"/admin/manage-admin"}>
          <p className="mt-5 text-lg px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-700 active:bg-red-900 duration-200">Go back</p>
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
