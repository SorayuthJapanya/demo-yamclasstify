import React from "react";
import AddSpeciesForm from "../../components/species/AddSpeciesForm";

const AddSpeciePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Add New Species</h1>
        <p className="text-gray-600">
          Fill out the form below to add a new species
        </p>
      </header>
      <div className="w-full max-w-2xl bg-white shadow-[0px_0px_30px_-16px_rgba(0,_0,_0,_0.8)] rounded-lg p-6 mb-10">
        <AddSpeciesForm />
      </div>
    </div>
  );
};

export default AddSpeciePage;
