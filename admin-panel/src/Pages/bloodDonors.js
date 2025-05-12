import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Create,
  ReferenceField,
  ReferenceInput,
} from "react-admin";

export const BloodDonorList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField label="User" source="user" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="address" />
      <TextField source="availabilityStatus" />
      <TextField source="contact" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const BloodDonorEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <ReferenceInput label="User" source="user" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="address" />
      <TextInput source="contact" />
      <SelectInput
        source="availabilityStatus"
        choices={[
          { id: "Available", name: "Available" },
          { id: "Unavailable", name: "Unavailable" },
          { id: "Emergency", name: "Emergency" },
        ]}
      />
    </SimpleForm>
  </Edit>
);

export const BloodDonorCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput label="User" source="user" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="address" />
      <TextInput source="contact" />
      <SelectInput
        source="availabilityStatus"
        choices={[
          { id: "Available", name: "Available" },
          { id: "Unavailable", name: "Unavailable" },
          { id: "Emergency", name: "Emergency" },
        ]}
      />
    </SimpleForm>
  </Create>
);
