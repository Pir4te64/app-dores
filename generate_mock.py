
files = [f'Carrusel de promos -{i:02d}.png' for i in range(1, 20)] + ['Promos del fin de semana dores-01.png']
categories = [
    {'id': 6, 'name': 'Combos'},
    {'id': 1, 'name': 'Hamburguesas'},
    {'id': 3, 'name': 'Pollos'},
    {'id': 2, 'name': 'Pizza'},
    {'id': 5, 'name': 'Alitas'}
]

print("const menuItems: MenuItem[] = [")
for i, filename in enumerate(files):
    cat = categories[i % len(categories)]
    price = 4500 + (i * 100)
    print("    {")
    print(f"        id: {i+1},")
    print(f"        commerceId: 1,")
    print(f"        name: 'Promo Especial {i+1}',")
    print(f"        description: 'Deliciosa promoción {i+1} con los mejores ingredientes.',")
    print(f"        price: {price},")
    print(f"        stock: true,")
    print(f"        image: [{{ id: {i+1}, name: 'promo{i+1}', type: 'image/png', url: require('../../assets/menu/{filename}') }}],")
    print(f"        category: {{ id: {cat['id']}, name: '{cat['name']}', urlImage: null }},")
    print(f"        dietaryRestrictions: [],")
    print("    },")
print("];")
