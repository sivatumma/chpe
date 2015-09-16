module.exports = function(mongoose) {
  var Schema = mongoose.Schema;
  var associateSchema = Schema({
    name: {
      type: String
    },
    associateType: {
      type: String,
      enum: "Diagnostics,Nursing Home,Speciality Hospital,Super Speciality Hospital,Clinic,Consultant,Specialist,Lab,Individual,Franchise,Corporate,Radiology".split(',')
    },
    gender: {
      type: String
    },
    contact_person_name: {
      type: String
    },
    email: {
      type: String
    },
    mobile_number: {
      type: String
    },
    registered_name: {
      type: String
    },
    legal_entity: {
      type: String
    },
    name_of_signatory: {
      type: String
    },
    signatory_position: {
      type: String
    },
    registration_no: {
      type: String
    },
    year_of_registration_dd: {
      type: Date
    },
    clinical_establishment_license_no: {
      type: String
    },
    valid_from_to_valid_to_date: {
      type: Date
    },
    branches: {
      type: []
    },
    specialty: {
      type: String
    },
    license_no: {
      type: String
    },
    valid_from_valid_to_date: {
      type: Date
    },
    license_details: {
      type: String
    },
    service_tax_registration_no: {
      type: String
    },
    pf_registration: {
      type: String
    },
    wct_registration: {
      type: String
    },
    memorandum_of_articles: {
      type: String
    },
    list_of_directors: {
      type: String
    },
    medical_council_of_india_registration_no: {
      type: String
    },
    state_medical_council_registration_no: {
      type: String
    },
    nabh: {
      type: String
    },
    nabl: {
      type: String
    },
    brea: {
      type: String
    },
    barc_license_no_for_x_ray_labs: {
      type: String
    },
    pollution_control_board_license_no: {
      type: String
    },
    year_of_establishment: {
      type: Date
    },
    building_own: {
      type: String
    },
    building_lease: {
      type: String
    },
    branches: {
      type: []
    },
    specialization: {
      type: []
    },
    monthly_patient_treated_out_patient: {
      type: String
    },
    monthly_patient_treated_in_patient: {
      type: String
    },
    in_house_consultants: {
      type: []
    },
    honorary: {
      type: []
    },
    number_of_doctors: {
      type: Number
    },
    number_of_nurses: {
      type: Number
    },
    number_of_paramedical_staff: {
      type: Number
    },
    number_of_other_staff: {
      type: Number
    },
    certifications: {
      type: String
    },
    general_ward_beds: {
      type: []
    },
    icu_beds: {
      type: Number
    },
    number_of_operation_theatres: {
      type: Number
    },
    network_of_computers: {
      type: String
    },
    availability: {
      pantry: {
        type: Boolean
      },
      casualty_department: {
        type: String
      },
      ramp_provision: {
        type: Boolean
      },
      lift_provision: {
        type: Boolean
      },
      pharmacy: {
        type: Boolean
      },
      lab: {
        type: Boolean
      }
    },
    floor_space: {
      type: String
    },
    land_space: {
      type: String
    },
    experience: {
      type: String
    },
    qualifications: {
      type: String
    },
    associations: {
      type: String
    },
    pioneering: {
      type: String
    },
    research_and_publication: {
      type: String
    },
    accreditations: {
      type: String
    },
    number_of_automatic_analyzer_test: {
      type: Number
    },
    number_of_manual_methods_tests: {
      type: Number
    },
    number_of_technician: {
      type: Number
    },
    online_reports: {
      type: String
    },
    hl7_compliant_format: {
      type: String
    },
    dicom: {
      type: String
    },
    hrct: {
      type: String
    },
    ct: {
      type: String
    },
    mri: {
      type: String
    },
    ultra_sound: {
      type: String
    },
    diagnostics_services_tree: {
      type: String
    },
    diagnostics_services_tree: {
      type: String
    },
    consultant: {
      type: String
    },
    hospital_wip: {
      type: String
    },
    clinic_wip: {
      type: String
    },
    interface_section_sheet: {
      type: String
    },
    beneficiary_name: {
      type: String
    },
    account_number: {
      type: String
    },
    bank_name: {
      type: String
    },
    branch_name_and_address: {
      type: String
    },
    bank_account_number: {
      type: String
    },
    ifsc_code: {
      type: String
    },
    pan_card_number: {
      type: String
    },
    type_of_pan_card: {
      type: String
    },
    bank_certificate: {
      type: String
    },
    three_years_financials: {
      type: String
    },
    three_years_income_tax_returns: {
      type: String
    },
    telephone_bill_for_address_proof: {
      type: String
    }
  });

  var reasons = associateSchema.statics.failureReasons = {
    NOT_FOUND: 0,
    NOT_AUTHORIZED: 1,
    VALIDATION_FAILURE: 2
  };

  var Associate = mongoose.model('Associate', associateSchema);

  Associate.schema.path('email').validate(function(email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
  }, 'The e-mail field cannot be empty.');

  return Associate;
}