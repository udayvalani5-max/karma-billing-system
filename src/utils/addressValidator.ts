
export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export const validateAddress = (address: AddressData): boolean => {
  // Basic validation rules
  const streetPattern = /^[a-zA-Z0-9\s,.-]+$/;
  const cityPattern = /^[a-zA-Z\s.-]+$/;
  const statePattern = /^[a-zA-Z\s]{2,}$/;
  const zipPattern = /^\d{5}(-\d{4})?$/;

  return (
    address.street.trim().length > 0 &&
    streetPattern.test(address.street) &&
    address.city.trim().length > 0 &&
    cityPattern.test(address.city) &&
    address.state.trim().length > 0 &&
    statePattern.test(address.state) &&
    zipPattern.test(address.zipCode)
  );
};

export const formatAddress = (address: AddressData): string => {
  return `${address.street}\n${address.city}, ${address.state} ${address.zipCode}`;
};
