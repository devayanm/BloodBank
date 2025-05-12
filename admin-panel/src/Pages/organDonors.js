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

export const OrganDonorList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField label="User" source="user" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="organ" />
      <TextField source="urgency" />
      <TextField source="trust" />
      <TextField source="verified" />
      <TextField source="contact" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const OrganDonorEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <ReferenceInput label="User" source="user" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <SelectInput
        source="organ"
        choices={[
          { id: "Kidney", name: "Kidney" },
          { id: "Liver", name: "Liver" },
          { id: "Heart", name: "Heart" },
          { id: "Lung", name: "Lung" },
          { id: "Pancreas", name: "Pancreas" },
          { id: "Intestine", name: "Intestine" },
          { id: "Other", name: "Other" },
        ]}
      />
      <SelectInput
        source="urgency"
        choices={[
          { id: "High", name: "High" },
          { id: "Medium", name: "Medium" },
          { id: "Low", name: "Low" },
        ]}
      />
      <SelectInput
        source="trust"
        choices={[
          { id: "Bronze", name: "Bronze" },
          { id: "Silver", name: "Silver" },
          { id: "Gold", name: "Gold" },
          { id: "Platinum", name: "Platinum" },
        ]}
      />
      <TextInput source="contact" />
      <TextInput source="address" />
      <TextInput source="notes" />
      <SelectInput
        source="verified"
        choices={[
          { id: true, name: "Verified" },
          { id: false, name: "Not Verified" },
        ]}
      />
    </SimpleForm>
  </Edit>
);

export const OrganDonorCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput label="User" source="user" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <SelectInput
        source="organ"
        choices={[
          { id: "Kidney", name: "Kidney" },
          { id: "Liver", name: "Liver" },
          { id: "Heart", name: "Heart" },
          { id: "Lung", name: "Lung" },
          { id: "Pancreas", name: "Pancreas" },
          { id: "Intestine", name: "Intestine" },
          { id: "Other", name: "Other" },
        ]}
      />
      <SelectInput
        source="urgency"
        choices={[
          { id: "High", name: "High" },
          { id: "Medium", name: "Medium" },
          { id: "Low", name: "Low" },
        ]}
      />
      <SelectInput
        source="trust"
        choices={[
          { id: "Bronze", name: "Bronze" },
          { id: "Silver", name: "Silver" },
          { id: "Gold", name: "Gold" },
          { id: "Platinum", name: "Platinum" },
        ]}
      />
      <TextInput source="contact" />
      <TextInput source="address" />
      <TextInput source="notes" />
      <SelectInput
        source="verified"
        choices={[
          { id: true, name: "Verified" },
          { id: false, name: "Not Verified" },
        ]}
      />
    </SimpleForm>
  </Create>
);
