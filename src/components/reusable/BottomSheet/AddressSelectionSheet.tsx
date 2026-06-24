import React from "react";

import {
  ScrollView,
} from "react-native";
import AddressCard from "../../tabs/profile/address/AddressCard";


const AddressSelectionSheet = ({
  addresses,
  selectedId,
  onSelect,
}: any) => {
  return (
    <ScrollView
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      {addresses.map(
        (item: any) => (
          <AddressCard
            key={item._id}
            data={item}
            showSelectOption
            selected={
              item._id ===
              selectedId
            }
            onSelect={() =>
              onSelect(item)
            }
          />
        )
      )}
    </ScrollView>
  );
};

export default AddressSelectionSheet;