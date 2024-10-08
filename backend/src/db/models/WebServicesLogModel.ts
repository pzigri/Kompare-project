import mongoose, { Schema, Document } from 'mongoose';

//ovo je prema dokumentu, jedan broj 

interface RequestParams {
  policyID: string | null;
  oib: string;
  licensePlateNumber: string;
  policyType: string;
}

interface Rider {
  premium: number | null;
  selected: string;
  name: string;
  rider: string;
}

interface PolicyRole {
  streetID: number;
  email: string | null;
  postID: number;
  firstName: string;
  type: string;
  dateOfBirth: string;
  customerType: string;
  leasing: string;
  telephoneNumber: string | null;
  name: string;
  postNumber: string;
  oib: string;
  homeNumber: string;
  cityID: number;
  street: string;
  lastName: string;
}

interface PolicyVehicle {
  manufactureYear: string;
  power: string;
  type: string;
  model: string;
  make: string;
  kind: string;
  licensePlateNumber: string;
  VIN: string;
}

interface Policy {
  insuranceCommencementDate: string;
  policyNumber: string;
  insuranceExpirationDate: string;
  totalPremium: number;
  status: string;
  policyID: number;
  policyType: string;
  documentIssueDate: string;
  premiumForCharging: number;
  currencyLabel: string;
}

interface ParsedResponse {
  result: { isSuccess: boolean }; //ako je prikaz rezultata bio uspješan, odgovor će biti: isSuccess: true, u suprotnom: isSuccess: false
  riders: Rider[];
  surchargesDiscounts: any;
  policyRoles: PolicyRole[];
  policyVehicle: PolicyVehicle;
  policy: Policy;
}

interface ResponseVariables {
  parsedResponse: ParsedResponse;
  responseXml: string;
  requestJson: RequestParams;
}


//IWebServicesLog je TypeScript sučelje koje proširuje Mongooseov Document. To znači da ovaj model predstavlja dokument u MongoDB-u.
export interface IWebServicesLog extends Document {
  brandCode: string;
  category: string;
  serviceKey: string;
  requestParams: RequestParams;
  responseVariables: ResponseVariables;
  createdOn: Date;
}

const RequestParamsSchema = new Schema({
  policyID: { type: String, default: null },
  oib: { type: String, required: true },
  licensePlateNumber: { type: String, required: true },
  policyType: { type: String, required: true }
});

const RiderSchema = new Schema({
  premium: { type: Number, default: null },
  selected: { type: String, required: true },
  name: { type: String, required: true },
  rider: { type: String, required: true }
});

const PolicyRoleSchema = new Schema({
  streetID: { type: Number, required: true },
  email: { type: String, default: null },
  postID: { type: Number, required: true },
  firstName: { type: String, required: true },
  type: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  customerType: { type: String, required: true },
  leasing: { type: String, required: true },
  telephoneNumber: { type: String, default: null },
  name: { type: String, required: true },
  postNumber: { type: String, required: true },
  oib: { type: String, required: true },
  homeNumber: { type: String, required: true },
  cityID: { type: Number, required: true },
  street: { type: String, required: true },
  lastName: { type: String, required: true }
});

const PolicyVehicleSchema = new Schema({
  manufactureYear: { type: String, required: true },
  power: { type: String, required: true },
  type: { type: String, required: true },
  model: { type: String, required: true },
  make: { type: String, required: true },
  kind: { type: String, required: true },
  licensePlateNumber: { type: String, required: true },
  VIN: { type: String, required: true }
});

const PolicySchema = new Schema({
  insuranceCommencementDate: { type: String, required: true },
  policyNumber: { type: String, required: true },
  insuranceExpirationDate: { type: String, required: true },
  totalPremium: { type: Number, required: true },
  status: { type: String, required: true },
  policyID: { type: Number, required: true },
  policyType: { type: String, required: true },
  documentIssueDate: { type: String, required: true },
  premiumForCharging: { type: Number, required: true },
  currencyLabel: { type: String, required: true }
});

const ParsedResponseSchema = new Schema({
  result: { type: Object, required: true },
  riders: { type: [RiderSchema], required: true },
  surchargesDiscounts: { type: Schema.Types.Mixed, default: null },
  policyRoles: { type: [PolicyRoleSchema], required: true },
  policyVehicle: { type: PolicyVehicleSchema, required: true },
  policy: { type: PolicySchema, required: true }
});

const ResponseVariablesSchema = new Schema({
  parsedResponse: { type: ParsedResponseSchema, required: true },
  responseXml: { type: String, required: true },
  requestJson: { type: RequestParamsSchema, required: true }
});

const WebServicesLogSchema = new Schema({
  brandCode: { type: String, required: true },
  category: { type: String, required: true },
  serviceKey: { type: String, required: true },
  requestParams: { type: RequestParamsSchema, required: true },
  responseVariables: { type: ResponseVariablesSchema, required: true },
  createdOn: { type: Date, default: Date.now }
});

export default mongoose.model<IWebServicesLog>('WebServicesLog', WebServicesLogSchema, 'WebServicesLog');
