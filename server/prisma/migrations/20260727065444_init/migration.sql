BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[categories] (
    [id] INT NOT NULL IDENTITY(1,1),
    [slug] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(max) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [categories_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [categories_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[products] (
    [id] INT NOT NULL IDENTITY(1,1),
    [slug] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [brand] NVARCHAR(1000) NOT NULL,
    [price] DECIMAL(10,2) NOT NULL,
    [compareAtPrice] DECIMAL(10,2),
    [currency] NVARCHAR(1000) NOT NULL CONSTRAINT [products_currency_df] DEFAULT 'USD',
    [imagesJson] NVARCHAR(max) NOT NULL,
    [imageBg] NVARCHAR(1000) NOT NULL,
    [colorsJson] NVARCHAR(max) NOT NULL,
    [sizesJson] NVARCHAR(max) NOT NULL,
    [rating] FLOAT(53) NOT NULL CONSTRAINT [products_rating_df] DEFAULT 0,
    [reviewCount] INT NOT NULL CONSTRAINT [products_reviewCount_df] DEFAULT 0,
    [description] NVARCHAR(max) NOT NULL,
    [featuresJson] NVARCHAR(max) NOT NULL,
    [tagsJson] NVARCHAR(max) NOT NULL,
    [isNew] BIT NOT NULL CONSTRAINT [products_isNew_df] DEFAULT 0,
    [inStock] BIT NOT NULL CONSTRAINT [products_inStock_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [products_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [categoryId] INT NOT NULL,
    CONSTRAINT [products_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [products_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[cart_items] (
    [id] INT NOT NULL IDENTITY(1,1),
    [quantity] INT NOT NULL,
    [size] NVARCHAR(1000) NOT NULL,
    [color] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [cart_items_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [cart_items_userId_productId_size_color_key] UNIQUE NONCLUSTERED ([userId],[productId],[size],[color])
);

-- CreateTable
CREATE TABLE [dbo].[wishlist_items] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [wishlist_items_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [wishlist_items_userId_productId_key] UNIQUE NONCLUSTERED ([userId],[productId])
);

-- CreateTable
CREATE TABLE [dbo].[addresses] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(1000) NOT NULL,
    [line1] NVARCHAR(1000) NOT NULL,
    [line2] NVARCHAR(1000),
    [city] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [postalCode] NVARCHAR(1000) NOT NULL,
    [country] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [addresses_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[orders] (
    [id] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [orders_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [orders_status_df] DEFAULT 'processing',
    [subtotal] DECIMAL(10,2) NOT NULL,
    [shipping] DECIMAL(10,2) NOT NULL,
    [tax] DECIMAL(10,2) NOT NULL,
    [total] DECIMAL(10,2) NOT NULL,
    [paymentMethod] NVARCHAR(1000) NOT NULL,
    [shippingFullName] NVARCHAR(1000) NOT NULL,
    [shippingLine1] NVARCHAR(1000) NOT NULL,
    [shippingLine2] NVARCHAR(1000),
    [shippingCity] NVARCHAR(1000) NOT NULL,
    [shippingState] NVARCHAR(1000) NOT NULL,
    [shippingPostalCode] NVARCHAR(1000) NOT NULL,
    [shippingCountry] NVARCHAR(1000) NOT NULL,
    [shippingPhone] NVARCHAR(1000) NOT NULL,
    [userId] INT NOT NULL,
    CONSTRAINT [orders_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[order_items] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [imageBg] NVARCHAR(1000) NOT NULL,
    [price] DECIMAL(10,2) NOT NULL,
    [quantity] INT NOT NULL,
    [size] NVARCHAR(1000) NOT NULL,
    [color] NVARCHAR(1000) NOT NULL,
    [orderId] NVARCHAR(1000) NOT NULL,
    [productId] INT NOT NULL,
    CONSTRAINT [order_items_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[contact_messages] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [subject] NVARCHAR(1000) NOT NULL,
    [message] NVARCHAR(max) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [contact_messages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [contact_messages_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[newsletter_subscribers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [newsletter_subscribers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [newsletter_subscribers_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [newsletter_subscribers_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[products] ADD CONSTRAINT [products_categoryId_fkey] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[categories]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cart_items] ADD CONSTRAINT [cart_items_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[cart_items] ADD CONSTRAINT [cart_items_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[wishlist_items] ADD CONSTRAINT [wishlist_items_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[wishlist_items] ADD CONSTRAINT [wishlist_items_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[addresses] ADD CONSTRAINT [addresses_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[orders] ADD CONSTRAINT [orders_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [order_items_orderId_fkey] FOREIGN KEY ([orderId]) REFERENCES [dbo].[orders]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[order_items] ADD CONSTRAINT [order_items_productId_fkey] FOREIGN KEY ([productId]) REFERENCES [dbo].[products]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
