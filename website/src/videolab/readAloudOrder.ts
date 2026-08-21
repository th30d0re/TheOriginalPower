interface ElementRegistration<ElementType> {
  element: ElementType;
}

export function orderByDocumentElements<
  ElementType,
  Registration extends ElementRegistration<ElementType>,
>(registrations: Iterable<Registration>, documentElements: Iterable<ElementType>): Registration[] {
  const byElement = new Map<ElementType, Registration>();
  for (const registration of registrations) byElement.set(registration.element, registration);

  const ordered: Registration[] = [];
  for (const element of documentElements) {
    const registration = byElement.get(element);
    if (registration) ordered.push(registration);
  }
  return ordered;
}
