module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var diagnosticsSchema = Schema({

        _id: {
            type: String
        },
        category: {
            type: String
        },
        loinc: {
            type: String
        },
        testName: {
            type: String

        },
        testDid: {
            type: String
        },
        testDescription: {

            type: String
        },
        mnemonicName: {
            type: String

        },
        isProfile: {

            type: Boolean,
            default: false
        },
        isActive: {

            type: Boolean,
            default: false
        },
        departmentCode: {
            type: String
        },
        departmentName: {
            type: String
        },
        inHouseOrOut: {
            type: String
        },
        testPlatform: {
            type: String
        },
        methodology: {
            type: String
        },
        reason: {
            type: String
        },
        displayOrder: {
            type: Number
        },
        standardCost: {
            type: String
        },
        testMnemonic: {

            type: String
        },
        collectionInstructionForMHO: {
            type: String
        },
        collectionInstructionForCCO: {

            type: String
        },
        sampleTypeDid: {
            type: String
        },
        sampleTypeName: {

            type: String
        },
        containerTypeDid: {
            type: String
        },
        containerTypeName: {

            type: String
        },
        sampleVolume: {
            type: String
        },
        schedule: {
            type: String
        },
        minSampleVolume: {
            type: String
        },
        cutOffTime: {
            type: String
        },
        reportedTimeInterval: {
            type: String
        },
        sameDayReportingTime: {

            type: String
        },
        isPrescribed: {
            type: String
        },
        isAssessmentReq: {
            type: String
        },
        isFacilitationReq: {
            type: String
        },
        standardCostPercentage: {
            type: String
        },
        TimeForSampleCollection: {
            type: Number
        }


    });


    var DiagnosticsMaster = mongoose.model('DiagnosticsMaster', diagnosticsSchema);

    return DiagnosticsMaster;
}