import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import { type Product, calculateEffectivePrice, calculateInstallmentPrice } from "../models/product"

// Definir el tipo para los documentos de la base de datos
type DBProduct = Omit<Product, "_id"> & { _id: ObjectId }

const DB_NAME = "fragancias"
const COLLECTION_NAME = "products"

// Obtener todos los productos
export async function getAllProducts(): Promise<Product[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const products = await db.collection<DBProduct>(COLLECTION_NAME).find({}).toArray()

  return products.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }))
}

// Obtener productos por categoría
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)
  const products = await db.collection<DBProduct>(COLLECTION_NAME).find({ category }).toArray()

  return products.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }))
}

// Obtener un producto por ID
export async function getProductById(id: string): Promise<Product | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  try {
    const product = await db.collection<DBProduct>(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })

    if (!product) return null

    return {
      ...product,
      _id: product._id.toString(),
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error)
    return null
  }
}

// Crear un nuevo producto
export async function createProduct(productData: Omit<Product, "_id">): Promise<Product> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  if (!productData.effectivePrice) {
    productData.effectivePrice = calculateEffectivePrice(productData.price, productData.discount)
  }

  if (productData.installments && !productData.installmentPrice) {
    productData.installmentPrice = calculateInstallmentPrice(productData.price, productData.installments)
  }

  const now = new Date()
  const productWithTimestamps = {
    ...productData,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection<DBProduct>(COLLECTION_NAME).insertOne(productWithTimestamps as DBProduct)

  return {
    ...productWithTimestamps,
    _id: result.insertedId.toString(),
  }
}

// Actualizar un producto existente
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const existingProduct = await getProductById(id)

  if (productData.price) {
    productData.effectivePrice = calculateEffectivePrice(
      productData.price,
      productData.discount || existingProduct?.discount
    )

    if (productData.installments || existingProduct?.installments) {
      productData.installmentPrice = calculateInstallmentPrice(
        productData.price,
        productData.installments || existingProduct?.installments || 6
      )
    }
  }

  productData.updatedAt = new Date()

  // Eliminamos _id de productData para evitar actualizarlo
  const { _id, ...updateData } = productData

  // Hacemos la actualización y forzamos el tipo para que TS entienda que retorna DBProduct | null
  const updatedProduct = await db
    .collection<DBProduct>(COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    ) as unknown as DBProduct | null

  if (!updatedProduct) return null

  return {
    ...updatedProduct,
    _id: updatedProduct._id.toString(),
  }
}

// Eliminar un producto
export async function deleteProduct(id: string): Promise<boolean> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  try {
    const result = await db.collection<DBProduct>(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    return false
  }
}

// Buscar productos
export async function searchProducts(query: string): Promise<Product[]> {
  const client = await clientPromise
  const db = client.db(DB_NAME)

  const products = await db
    .collection<DBProduct>(COLLECTION_NAME)
    .find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
    .toArray()

  return products.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }))
}
